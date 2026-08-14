#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Coffre expurgé — LE CREUSET.

Produit, depuis codex/MJ-SECRETS.md :

  codex/MJ-SECRETS-VUE.md   la vue lue en séance. Contenu intégral, mais
                            chaque nom scellé remplacé par un jeton stable
                            ⟦SCELLE-N⟧. Le MJ garde la matière — donc ses
                            préfigurations — et perd l'étiquette : il ne
                            peut plus taper le nom, il ne l'a pas.

  codex/NOMS-SCELLES.txt    la correspondance jeton → nom. ⛔ NE SE LIT PAS.
                            Sert au hook, et à livrer-nom.py le jour venu.

Deux listes, deux objectifs opposés :
  - la VUE veut du rappel     — sur-expurger ne coûte qu'une gêne de lecture,
                                rater un nom le laisse dans le contexte du MJ ;
  - le HOOK veut de la précision — un hook qui sonne à tort est un hook qu'on
                                éteint. Seuls les noms restés muets sur les
                                transcripts réels reçoivent alerte=oui.

CE SCRIPT N'AFFICHE AUCUN NOM. Il ne rend que des comptes.

    python .claude/hooks/generer-vue.py

À relancer à chaque codex, et après toute modification de MJ-SECRETS.
"""
import glob
import json
import os
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RACINE = Path(__file__).resolve().parents[2]
SECRETS = RACINE / "codex" / "MJ-SECRETS.md"
VUE = RACINE / "codex" / "MJ-SECRETS-VUE.md"
CARTE = RACINE / "codex" / "NOMS-SCELLES.txt"
TRANSCRIPTS = Path.home() / ".claude" / "projects" / "C--Users-sbroda-Documents-Claude-story"

# Mot capitalisé (Xxx) ou tout en capitales (XXX), accents compris.
MOT = (
    r"\b[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸÆŒ][a-zà-öø-ÿ]{2,}\b"
    r"|\b[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸÆŒ]{3,}\b"
)


def _corpus() -> str:
    """Tout le corpus sauf le coffre : ce qui y figure est déjà sorti."""
    fichiers = [p for p in (RACINE / "codex").glob("*.md")
                if p.name not in {"MJ-SECRETS.md", "MJ-SECRETS-VUE.md"}]
    fichiers.append(RACINE / "codexcreuset.md")
    return "\n".join(p.read_text(encoding="utf-8") for p in fichiers if p.exists())


def noms_sceles(secrets: str) -> list[str]:
    """Est scellé ce qui est dans le coffre et nulle part ailleurs."""
    corpus = _corpus()
    trouves = {
        c for c in re.findall(MOT, secrets)
        if not re.search(rf"\b{re.escape(c)}\b", corpus, re.IGNORECASE)
    }
    return sorted(trouves)


def muets(noms: list[str]) -> set[str]:
    """Noms jamais apparus dans la sortie MJ passée — donc sûrs à alerter.

    Sans transcripts (session cloud, machine neuve) : repli sur les noms
    déclarés en capitales, qui sont les noms propres du coffre.
    """
    fichiers = sorted(glob.glob(str(TRANSCRIPTS / "*.jsonl")),
                      key=os.path.getmtime, reverse=True)[:8]
    if not fichiers:
        return {n for n in noms if n.isupper()}

    vus: set[str] = set()
    for f in fichiers:
        for ligne in open(f, encoding="utf-8"):
            if not ligne.strip():
                continue
            try:
                r = json.loads(ligne)
            except json.JSONDecodeError:
                continue
            if r.get("isSidechain") or r.get("type") != "assistant":
                continue
            contenu = r.get("message", {}).get("content", [])
            for b in contenu if isinstance(contenu, list) else []:
                if b.get("type") == "text":
                    t = b.get("text", "")
                    for n in noms:
                        if n not in vus and re.search(rf"\b{re.escape(n)}\b", t, re.IGNORECASE):
                            vus.add(n)
    return set(noms) - vus


def carte_existante() -> dict[str, tuple[int, str]]:
    """nom -> (id, statut). Les identifiants ne bougent jamais."""
    if not CARTE.exists():
        return {}
    out = {}
    for ligne in CARTE.read_text(encoding="utf-8").splitlines():
        if not ligne.strip() or ligne.startswith("#"):
            continue
        parts = ligne.split("\t")
        if len(parts) >= 3 and parts[0].isdigit():
            out[parts[1]] = (int(parts[0]), parts[2])
    return out


def main() -> int:
    if not SECRETS.exists():
        print(f"ERREUR : {SECRETS} introuvable", file=sys.stderr)
        return 1

    secrets = SECRETS.read_text(encoding="utf-8")
    noms = noms_sceles(secrets)
    ancienne = carte_existante()
    surs = muets(noms)

    # Identifiants stables : on garde ceux qui existent, on n'ajoute qu'après.
    prochain = max((i for i, _ in ancienne.values()), default=0) + 1
    lignes, remplacements = [], []
    for n in noms:
        if n in ancienne:
            ident, statut = ancienne[n]
        else:
            ident, statut = prochain, "scelle"
            prochain += 1
        alerte = "oui" if n in surs else "non"
        lignes.append((ident, n, statut, alerte))
        if statut == "scelle":
            remplacements.append((ident, n))

    # Les noms déjà livrés en scène restent en clair dans la vue.
    vue = secrets
    for ident, n in sorted(remplacements, key=lambda x: -len(x[1])):
        vue = re.sub(rf"\b{re.escape(n)}\b", f"⟦SCELLE-{ident}⟧", vue)

    VUE.write_text(
        "> **VUE EXPURGÉE DU COFFRE — c'est ce fichier qui se lit en séance,\n"
        "> jamais `MJ-SECRETS.md`.** Chaque `⟦SCELLE-N⟧` est un nom propre non\n"
        "> encore livré en jeu. Le MJ garde toute la matière et n'a pas les\n"
        "> étiquettes : il ne peut donc pas les faire fuiter.\n"
        ">\n"
        "> Le jour où la fiction livre un nom : `python .claude/hooks/livrer-nom.py N`\n"
        "> — acte délibéré, jamais un nom qui traîne dans le contexte.\n"
        ">\n"
        "> **Généré. Ne pas éditer à la main** : écrire dans `MJ-SECRETS.md`,\n"
        "> puis relancer `generer-vue.py`.\n\n"
        + vue,
        encoding="utf-8",
    )

    CARTE.write_text(
        "# NOMS SCELLÉS — LE CREUSET\n"
        "# ⛔ NE PAS LIRE. Ni le joueur, ni le MJ. Généré par generer-vue.py.\n"
        "# id <TAB> nom <TAB> statut(scelle|livre) <TAB> alerte(oui|non)\n"
        "# alerte=non : expurgé de la vue, mais trop bruyant pour le hook.\n"
        + "".join(f"{i}\t{n}\t{s}\t{a}\n" for i, n, s, a in sorted(lignes)),
        encoding="utf-8",
    )

    scelles = [x for x in lignes if x[2] == "scelle"]
    print(f"noms scellés (expurgés de la vue) : {len(scelles)}")
    print(f"  dont surveillés par le hook     : {sum(1 for x in scelles if x[3] == 'oui')}")
    print(f"  vue seule (trop bruyants)       : {sum(1 for x in scelles if x[3] == 'non')}")
    print(f"déjà livrés (laissés en clair)    : {len(lignes) - len(scelles)}")
    print(f"-> {VUE.relative_to(RACINE)}  ({VUE.stat().st_size} octets)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
