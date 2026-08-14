#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Hook Stop — LE CREUSET. Deux métiers, à chaque fin de tour du MJ.

1. GARDE-FOU  : cherche un nom scellé dans la sortie joueur. Si touche,
                sort en code 2 — le MJ est repris avant de rendre la main.
2. DÉPÔT      : écrit le dernier tour dans .claude/derniere-scene.md, brut.
                C'est la source des sous-agents (relevé d'état, psy) : ils
                ne voient pas la conversation, et le MJ ne choisit pas ce
                qu'ils auditent.

Le garde-fou est un filet, pas la ligne de défense : quand il sonne, le
message est déjà affiché. Il garantit qu'on le sait dans la seconde.

Entrée : JSON sur stdin (transcript_path, stop_hook_active).
"""
import json
import re
import sys
from pathlib import Path

sys.stderr.reconfigure(encoding="utf-8", errors="replace")

RACINE = Path(__file__).resolve().parents[2]
NOMS = RACINE / "codex" / "NOMS-SCELLES.txt"
DEPOT = RACINE / ".claude" / "derniere-scene.md"


def charger_noms() -> list[str]:
    """Noms encore scellés ET assez rares pour ne pas faire sonner à tort.

    Format : id <TAB> nom <TAB> statut <TAB> alerte — voir generer-vue.py.
    Les entrées alerte=non sont expurgées de la vue du coffre mais pas
    surveillées ici : elles apparaissent en jeu, elles feraient du bruit.
    """
    if not NOMS.exists():
        return []
    noms = []
    for l in NOMS.read_text(encoding="utf-8").splitlines():
        if not l.strip() or l.startswith("#"):
            continue
        parts = l.split("\t")
        if len(parts) >= 4 and parts[2] == "scelle" and parts[3] == "oui":
            noms.append(parts[1])
    return noms


def dernier_tour(transcript: Path) -> str:
    """Texte du dernier tour du MJ — hors sous-agents, hors appels d'outil."""
    try:
        rows = [
            json.loads(l)
            for l in transcript.read_text(encoding="utf-8").splitlines()
            if l.strip()
        ]
    except (OSError, json.JSONDecodeError):
        return ""

    morceaux: list[str] = []
    for r in reversed(rows):
        if r.get("isSidechain"):
            continue  # sortie d'un sous-agent : jamais vue par le joueur
        t = r.get("type")
        contenu = r.get("message", {}).get("content")

        if t == "user":
            # Les résultats d'outil reviennent aussi en type "user" : ce n'est
            # pas le joueur, on continue de remonter. Seul un vrai message
            # ferme le tour.
            if isinstance(contenu, str):
                break
            if isinstance(contenu, list) and any(
                b.get("type") != "tool_result" for b in contenu
            ):
                break
            continue

        if t != "assistant" or not isinstance(contenu, list):
            continue
        for b in reversed(contenu):
            if b.get("type") == "text" and b.get("text", "").strip():
                morceaux.append(b["text"])
    return "\n\n".join(reversed(morceaux)).strip()


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0  # pas de payload exploitable : ne jamais bloquer le jeu

    # Déjà repris une fois sur ce tour : ne pas boucler.
    deja = bool(payload.get("stop_hook_active"))

    transcript = Path(payload.get("transcript_path", ""))
    texte = dernier_tour(transcript) if transcript.exists() else ""

    if texte:
        DEPOT.parent.mkdir(parents=True, exist_ok=True)
        DEPOT.write_text(texte, encoding="utf-8")

    if deja or not texte:
        return 0

    touches = [
        n for n in charger_noms()
        if re.search(rf"\b{re.escape(n)}\b", texte, re.IGNORECASE)
    ]
    if touches:
        print(
            "GARDE-FOU COFFRE — un nom scellé est apparu dans la sortie joueur : "
            + ", ".join(touches)
            + ".\nErrata §1 : un nom fuité est brûlé. Le message est déjà affiché.\n"
            "Traiter maintenant, avant toute suite : dire au joueur ce qui vient "
            "de se produire, et ouvrir l'errata.\n"
            "Si c'est un faux positif (mot commun capté par l'extraction), le dire "
            "en une ligne et continuer.",
            file=sys.stderr,
        )
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
