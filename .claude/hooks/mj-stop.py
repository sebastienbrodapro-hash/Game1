#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Hook Stop — LE CREUSET. Trois métiers, à chaque fin de tour du MJ.

1. GARDE-FOU  : cherche un nom scellé dans la sortie joueur. Si touche,
                sort en code 2 — le MJ est repris avant de rendre la main.
2. DÉPÔT      : écrit le dernier tour dans .claude/derniere-scene.md, brut.
                C'est la source du psy : il ne voit pas la conversation, et
                le MJ ne choisit pas ce qu'il lui donne à auditer.
3. CADENCE PSY: compte les scènes jouées et reprend le MJ quand le psy est
                dû. Raison d'être : une cadence que le MJ tient lui-même
                n'est pas une cadence — le MJ qui dérive est exactement
                celui qui n'appelle pas son audit. Ici il ne compte plus.
                *(Validé par le joueur le 2026-08-14, option C'.)*

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
ETAT = RACINE / ".claude" / "psy-etat.txt"

SEUIL_PSY = 8
TITRE_SCENE = re.compile(r"^##\s*(\d{1,4})\s*·", re.MULTILINE)


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


def lire_etat() -> tuple[int, int]:
    """(numéro de la dernière scène vue, numéro du dernier passage du psy)."""
    derniere = dernier_psy = 0
    if ETAT.exists():
        for l in ETAT.read_text(encoding="utf-8").splitlines():
            cle, _, val = l.partition("=")
            val = val.strip()
            if not val.isdigit():
                continue
            if cle.strip() == "derniere_scene":
                derniere = int(val)
            elif cle.strip() == "dernier_psy":
                dernier_psy = int(val)
    return derniere, dernier_psy


def ecrire_etat(derniere: int, dernier_psy: int) -> None:
    ETAT.write_text(
        f"derniere_scene={derniere}\ndernier_psy={dernier_psy}\n", encoding="utf-8"
    )


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

    # Cadence : on suit le numéro de scène, pas un compteur de tours — un
    # point MJ ne fait pas avancer le jeu, et une scène ne recule jamais.
    derniere, dernier_psy = lire_etat()
    vus = [int(n) for n in TITRE_SCENE.findall(texte)]
    if vus and max(vus) > derniere:
        derniere = max(vus)
    if dernier_psy == 0:  # première initialisation : pas d'alerte au démarrage
        dernier_psy = derniere

    touches = [
        n for n in charger_noms()
        if re.search(rf"\b{re.escape(n)}\b", texte, re.IGNORECASE)
    ]
    if touches:
        ecrire_etat(derniere, dernier_psy)
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

    if derniere - dernier_psy >= SEUIL_PSY:
        # L'alerte est consommée tout de suite : un hook qui redemande à
        # chaque tour est un hook qu'on éteint.
        ecrire_etat(derniere, derniere)
        print(
            f"CADENCE PSY — {derniere - dernier_psy} scènes depuis le dernier "
            f"passage (sc. {dernier_psy} -> sc. {derniere}).\n"
            "Lancer le sous-agent `psy` maintenant, en arrière-plan, avant de "
            "rendre la main.\n"
            "Sa sortie se relaie MOT POUR MOT dans un message méta séparé de la "
            "fiction (codex §1.8) — la reformuler, c'est éditer son propre audit. "
            "SILENCE ne s'affiche pas.",
            file=sys.stderr,
        )
        return 2

    ecrire_etat(derniere, dernier_psy)
    return 0


if __name__ == "__main__":
    sys.exit(main())
