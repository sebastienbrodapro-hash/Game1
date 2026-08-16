#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Coffre expurgé — LE TRONC (campagne courante).

Produit, depuis monde/TRONC.md :

  monde/TRONC-VUE.md      la vue lue en séance. Matière intégrale, mais chaque
                          nom propre marqué `{{SCELLE:Nom}}` remplacé par un
                          jeton stable ⟦SCELLE-N⟧. Le MJ garde la matière —
                          donc ses préfigurations — et perd l'étiquette : il
                          ne peut plus taper le nom, il ne l'a pas.

  monde/NOMS-SCELLES.txt  la correspondance jeton → nom. ⛔ NE SE LIT PAS.
                          Sert au hook (mj-stop.py) et à livrer-nom.py le
                          jour venu. Format à quatre colonnes, celui qu'ils
                          attendent tous les deux :

                              id <TAB> nom <TAB> statut <TAB> alerte

                          statut  : scelle | livre
                          alerte  : oui | non — le hook ne surveille que les
                                    `oui`. Un nom trop courant sonnerait à
                                    tort, et un hook qui sonne à tort est un
                                    hook qu'on éteint.

CE SCRIPT N'AFFICHE AUCUN NOM. Il ne rend que des comptes.

    python .claude/hooks/generer-vue-tronc.py

À relancer après toute modification de TRONC.md, et à chaque `codex`.
Écrire **uniquement** dans TRONC.md — jamais dans la vue, qui est générée.

MARQUAGE — c'est l'auteur qui déclare, pas une heuristique : dans TRONC.md,
un nom propre qui ne doit pas encore atteindre le MJ s'écrit `{{SCELLE:Nom}}`.
Rien d'autre n'est scellé. (L'ancienne campagne devinait les noms par
soustraction de corpus ; la marque explicite est plus sûre et plus lisible.)

NUMÉROTATION — stable, par ordre d'apparition dans TRONC.md. Les identifiants
déjà attribués dans NOMS-SCELLES.txt ne bougent jamais : un jeton cité dans
une note de séance doit désigner la même chose six mois plus tard.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except AttributeError:  # pragma: no cover
    pass

RACINE = Path(__file__).resolve().parents[2]
TRONC = RACINE / "monde" / "TRONC.md"
VUE = RACINE / "monde" / "TRONC-VUE.md"
CARTE = RACINE / "monde" / "NOMS-SCELLES.txt"

MARQUE = re.compile(r"\{\{SCELLE:\s*([^}]+?)\s*\}\}")

# Le hook ignore déjà les noms de moins de quatre lettres : les déclarer
# surveillés ne ferait que du bruit dans la carte.
LONGUEUR_MINI = 4

# Filet de sécurité : des mots français assez courants pour qu'un nom propre
# qui leur ressemble fasse sonner le hook à tort, même s'ils n'apparaissent
# nulle part ailleurs dans le dépôt aujourd'hui.
COURANTS = {
    "aube", "argent", "arbre", "bois", "bronze", "brume", "cendre", "chant",
    "ciel", "coeur", "cœur", "corne", "creuset", "dent", "dette", "eau",
    "faim", "fer", "feu", "fleuve", "givre", "graine", "jade", "jour", "lune",
    "main", "marche", "mere", "mère", "mer", "mesure", "mont", "mort", "mot",
    "nuit", "ombre", "os", "pere", "père", "pierre", "plume", "poids", "porte",
    "prix", "puits", "racine", "reine", "roi", "ronce", "sang", "sel",
    "silence", "soif", "soir", "soleil", "souffle", "source", "seuil", "terre",
    "trait", "veille", "vent", "voix",
}

# Ce qui n'entre pas dans le corpus « prose ordinaire » : le coffre courant,
# le coffre de l'ancienne campagne, et tout ce qui n'est pas du texte du jeu.
EXCLUS = {
    "TRONC.md", "TRONC-VUE.md", "NOMS-SCELLES.txt",
    "MJ-SECRETS.md", "MJ-SECRETS-VUE.md",
}
DOSSIERS_EXCLUS = {".git", "build", "node_modules", "Game1", "reflexion",
                   ".agents", "__pycache__"}

ENTETE_VUE = (
    "> **VUE EXPURGÉE DU TRONC — c'est CE fichier qui se lit en séance,\n"
    "> jamais `TRONC.md`.** Chaque `⟦SCELLE-N⟧` est un nom propre non encore\n"
    "> livré en jeu. Le MJ garde toute la matière et n'a pas les étiquettes :\n"
    "> il ne peut donc pas les faire fuiter.\n"
    ">\n"
    "> Le jour où la fiction livre un nom : `python .claude/hooks/livrer-nom.py N`\n"
    "> — ou, sans shell, lire **la ligne N** de `NOMS-SCELLES.txt` : cette\n"
    "> ligne-là, jamais le fichier.\n"
    ">\n"
    "> **Généré. Ne pas éditer à la main** : écrire dans `TRONC.md`,\n"
    "> puis relancer `generer-vue-tronc.py`.\n\n"
)

ENTETE_CARTE = (
    "# NOMS SCELLÉS — CAMPAGNE COURANTE (monde/TRONC.md)\n"
    "# ⛔ NE PAS LIRE. Ni le joueur, ni le MJ. Généré par generer-vue-tronc.py.\n"
    "# id <TAB> nom <TAB> statut(scelle|livre) <TAB> alerte(oui|non)\n"
    "# alerte=non : expurgé de la vue, mais trop courant pour le hook.\n"
)


def corpus_ordinaire() -> str:
    """Toute la prose du dépôt sauf les coffres — de la langue de tous les jours.

    Un nom qui y figure déjà est un mot que le MJ écrit sans y penser : le
    surveiller ferait sonner le hook sur de la prose ordinaire.
    """
    morceaux = []
    for p in RACINE.rglob("*"):
        if p.suffix.lower() not in {".md", ".txt"} or not p.is_file():
            continue
        if p.name in EXCLUS or DOSSIERS_EXCLUS & set(p.relative_to(RACINE).parts):
            continue
        try:
            morceaux.append(p.read_text(encoding="utf-8"))
        except (OSError, UnicodeDecodeError):
            continue
    return "\n".join(morceaux)


def bruyant(nom: str, corpus: str) -> bool:
    """Vrai si surveiller ce nom ferait sonner le hook à tort."""
    if len(nom) < LONGUEUR_MINI:
        return True
    if nom.lower() in COURANTS:
        return True
    return re.search(rf"\b{re.escape(nom)}\b", corpus, re.IGNORECASE) is not None


def carte_existante() -> dict[str, tuple[int, str]]:
    """nom -> (id, statut). Les identifiants ne bougent jamais.

    Tolère l'ancien format à deux colonnes (id <TAB> nom) : les fichiers
    produits avant que la carte ne porte statut et alerte restent lisibles,
    et leurs identifiants sont conservés.
    """
    if not CARTE.exists():
        return {}
    out: dict[str, tuple[int, str]] = {}
    for ligne in CARTE.read_text(encoding="utf-8").splitlines():
        if not ligne.strip() or ligne.startswith("#"):
            continue
        parts = ligne.split("\t")
        if len(parts) >= 2 and parts[0].strip().isdigit():
            statut = parts[2].strip() if len(parts) >= 3 else "scelle"
            out[parts[1].strip()] = (int(parts[0]), statut or "scelle")
    return out


def main() -> int:
    if not TRONC.exists():
        print(f"ERREUR : {TRONC} introuvable", file=sys.stderr)
        return 1

    tronc = TRONC.read_text(encoding="utf-8")

    # Ordre d'apparition, sans doublon.
    ordre: list[str] = []
    for m in MARQUE.finditer(tronc):
        nom = m.group(1)
        if nom not in ordre:
            ordre.append(nom)

    ancienne = carte_existante()
    corpus = corpus_ordinaire()

    prochain = max((i for i, _ in ancienne.values()), default=0) + 1
    lignes: list[tuple[int, str, str, str]] = []
    ids: dict[str, int] = {}
    for nom in ordre:
        if nom in ancienne:
            ident, statut = ancienne[nom]
        else:
            ident, statut = prochain, "scelle"
            prochain += 1
        ids[nom] = ident
        alerte = "non" if bruyant(nom, corpus) else "oui"
        lignes.append((ident, nom, statut, alerte))

    # Un nom déjà livré en scène reste en clair dans la vue : il est public.
    scelles = {n for _, n, s, _ in lignes if s == "scelle"}

    def remplacer(m: re.Match[str]) -> str:
        nom = m.group(1)
        return f"⟦SCELLE-{ids[nom]}⟧" if nom in scelles else nom

    vue = MARQUE.sub(remplacer, tronc)

    # Contrôle avant écriture : un nom scellé écrit en clair quelque part sans
    # sa marque annulerait le dispositif. On teste les seules casses d'un nom
    # propre (comme le hook) — la prose ordinaire en minuscules ne compte pas.
    restes = sum(
        1 for n in scelles
        if any(re.search(rf"\b{re.escape(v)}\b", vue)
               for v in {n, n.capitalize(), n.upper()})
    )
    if restes:
        print(
            f"ERREUR : {restes} nom(s) scellé(s) apparaissent en clair dans "
            "TRONC.md, hors marque.\n"
            "VUE NON ÉCRITE — l'ancienne est conservée. Marquer ces occurrences "
            "`{{SCELLE:Nom}}` dans TRONC.md, puis relancer.",
            file=sys.stderr,
        )
        return 1

    VUE.write_text(ENTETE_VUE + vue, encoding="utf-8")
    CARTE.write_text(
        ENTETE_CARTE
        + "".join(f"{i}\t{n}\t{s}\t{a}\n" for i, n, s, a in sorted(lignes)),
        encoding="utf-8",
    )

    encore = [x for x in lignes if x[2] == "scelle"]
    print(f"marques dans le tronc             : {len(MARQUE.findall(tronc))}")
    print(f"noms scellés (expurgés de la vue) : {len(encore)}")
    print(f"  dont surveillés par le hook     : {sum(1 for x in encore if x[3] == 'oui')}")
    print(f"  vue seule (trop courants)       : {sum(1 for x in encore if x[3] == 'non')}")
    print(f"déjà livrés (laissés en clair)    : {len(lignes) - len(encore)}")
    print(f"-> {VUE.relative_to(RACINE)}  ({VUE.stat().st_size} octets)")
    print(f"-> {CARTE.relative_to(RACINE)}  ({CARTE.stat().st_size} octets)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
