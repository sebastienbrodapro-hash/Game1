#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extraction de la liste des noms scellés — LE CREUSET.

Lit codex/MJ-SECRETS.md, en sort les noms propres déclarés, retire ceux
déjà livrés en jeu (registre MJ-CASTING §0.0), et écrit codex/NOMS-SCELLES.txt.

CE SCRIPT N'AFFICHE AUCUN NOM. Il ne rend que des comptes.
C'est volontaire : ni le MJ ni le joueur ne doivent lire la liste.
Seul mj-stop.py la lit, au moment de vérifier une sortie.

Relancer après chaque livraison de nom en scène :
    python .claude/hooks/extraire-noms.py
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RACINE = Path(__file__).resolve().parents[2]
SECRETS = RACINE / "codex" / "MJ-SECRETS.md"
SORTIE = RACINE / "codex" / "NOMS-SCELLES.txt"

# Ce qui est écrit ailleurs que dans le coffre n'est plus dans le coffre.
# Tout le corpus est soustrait — registre, chronique, monde, arbre, errata,
# archives de séance, copies figées, état courant. Seul MJ-SECRETS échappe.
#
# Le réglage penche volontairement vers le faux négatif : un hook qui sonne
# à tort est un hook qu'on éteint, donc qui ne garde plus rien. Mesuré sur
# 218 000 mots de sortie MJ — la version large sonnait 170 fois.
def _en_jeu() -> list[Path]:
    fichiers = [p for p in (RACINE / "codex").glob("*.md") if p.name != "MJ-SECRETS.md"]
    fichiers.append(RACINE / "codexcreuset.md")
    return fichiers

# Mots en capitales qui ne sont pas des noms propres du monde.
STOPLIST = {
    "MJ", "PJ", "PNJ", "LE", "LA", "LES", "UN", "UNE", "DES", "DU", "DE",
    "ET", "OU", "EST", "SON", "SA", "SES", "CE", "CETTE", "QUI", "QUE",
    "PAS", "NE", "PLUS", "TOUT", "TOUS", "RIEN", "JAMAIS", "SUR", "SOUS",
    "DANS", "AVEC", "SANS", "POUR", "PAR", "AU", "AUX", "EN", "SE", "IL",
    "ELLE", "ILS", "ON", "NOTE", "ATTENTION", "RAPPEL", "REGLE", "RÈGLE",
    "FIXE", "FLEXIBLE", "ACCOMPLIE", "ACQUIS", "OUVERTE", "FERMEE", "FERMÉE",
    "VRAI", "FAUX", "OUI", "NON", "SC", "V", "CF", "ERRATA", "CODEX",
    "PALIER", "TERRE", "MURIM", "JOUEUR", "SECRET", "SECRETS", "COFFRE",
    "INTERDIT", "ABSOLU", "IMPORTANT", "CONSIGNES", "CALIBRATION", "TRAME",
    "VISAGES", "PREPARES", "PRÉPARÉS", "RECUPERABLES", "RÉCUPÉRABLES",
    "DESTINATION", "FINALE", "VERITE", "VÉRITÉ", "MONDE", "BETE", "BÊTE",
    "FONDATEUR", "NOMS", "INDICATIVE", "STRUCTURE", "SCEAU", "CAMPAGNE",
}

MIN_LONGUEUR = 3


def capitales(texte: str) -> set[str]:
    """Tokens entièrement en capitales, accents compris."""
    bruts = re.findall(r"\b[A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸÆŒ]{%d,}\b" % MIN_LONGUEUR, texte)
    return {t for t in bruts if t not in STOPLIST}


def sortis(candidats: set[str]) -> set[str]:
    """Candidats qui apparaissent ailleurs dans le corpus — donc plus scellés.

    Comparaison INSENSIBLE À LA CASSE, comme la recherche du hook : un mot
    écrit MASQUE dans le coffre et « Masque » partout ailleurs est sorti.
    """
    corpus = "\n".join(
        f.read_text(encoding="utf-8") for f in _en_jeu() if f.exists()
    )
    return {
        c for c in candidats
        if re.search(rf"\b{re.escape(c)}\b", corpus, re.IGNORECASE)
    }


def main() -> int:
    if not SECRETS.exists():
        print(f"ERREUR : {SECRETS} introuvable", file=sys.stderr)
        return 1

    tous = capitales(SECRETS.read_text(encoding="utf-8"))
    deja = sortis(tous)
    scelles = sorted(tous - deja)

    SORTIE.write_text(
        "# NOMS SCELLÉS — LE CREUSET\n"
        "# ⛔ NE PAS LIRE. Ni le joueur, ni le MJ. Seul mj-stop.py ouvre ce fichier.\n"
        "# Généré par .claude/hooks/extraire-noms.py — ne pas éditer à la main.\n"
        "# Un nom par ligne. Tout ce qui a touché le jeu (casting, chrono, monde,\n"
        "# arbre, codex racine) est retiré automatiquement : relancer le script\n"
        "# après chaque nom livré en scène, et à chaque codex.\n"
        + "\n".join(scelles) + "\n",
        encoding="utf-8",
    )

    print(f"candidats dans MJ-SECRETS : {len(tous)}")
    print(f"deja sortis (retires)     : {len(tous & deja)}")
    print(f"SCELLES ECRITS            : {len(scelles)}")
    print(f"-> {SORTIE.relative_to(RACINE)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
