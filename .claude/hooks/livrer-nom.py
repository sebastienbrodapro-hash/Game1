#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Livraison d'un nom scellé — CAMPAGNE COURANTE (le tronc).

    python .claude/hooks/livrer-nom.py 3

Rend le nom propre derrière ⟦SCELLE-3⟧, le marque livré, et régénère la vue
du tronc pour qu'il y apparaisse désormais en clair.

C'EST LE SEUL ENDROIT OÙ UN NOM SCELLÉ ENTRE DANS LE CONTEXTE DU MJ, et
c'est délibéré : errata §31 — une révélation tombe d'un coup, par une bouche,
contre quelque chose. Un nom ne traîne pas dans le contexte pendant quarante
scènes en attendant son heure ; on va le chercher le jour où on l'écrit.

Après livraison : l'inscrire au canon public de la campagne
(`monde/POUSSIERE.md` — la réserve de prénoms §14 si c'en est un) et à
l'errata, comme le 2026-08-13 pour la bête du Creuset (§1.1).
"""
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RACINE = Path(__file__).resolve().parents[2]
CARTE = RACINE / "monde" / "NOMS-SCELLES.txt"
GENERATEUR = RACINE / ".claude" / "hooks" / "generer-vue-tronc.py"


def main() -> int:
    if len(sys.argv) != 2 or not sys.argv[1].isdigit():
        print("usage : python .claude/hooks/livrer-nom.py N", file=sys.stderr)
        print("        (N = le numéro dans ⟦SCELLE-N⟧)", file=sys.stderr)
        return 1

    cible = int(sys.argv[1])
    if not CARTE.exists():
        print(f"ERREUR : {CARTE} introuvable — lancer generer-vue-tronc.py",
              file=sys.stderr)
        return 1

    lignes = CARTE.read_text(encoding="utf-8").splitlines()
    sortie, nom, deja = [], None, False

    for ligne in lignes:
        parts = ligne.split("\t")
        if ligne.startswith("#") or len(parts) < 4 or not parts[0].isdigit():
            sortie.append(ligne)
            continue
        ident, n, statut, alerte = int(parts[0]), parts[1], parts[2], parts[3]
        if ident == cible:
            nom = n
            deja = statut == "livre"
            statut = "livre"
        sortie.append(f"{ident}\t{n}\t{statut}\t{alerte}")

    if nom is None:
        print(f"ERREUR : aucun ⟦SCELLE-{cible}⟧ dans la carte.", file=sys.stderr)
        return 1

    CARTE.write_text("\n".join(sortie) + "\n", encoding="utf-8")

    r = subprocess.run(
        [sys.executable, str(GENERATEUR)],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    )
    if r.returncode != 0:
        print("ATTENTION : la vue n'a pas pu être régénérée.", file=sys.stderr)
        print(r.stderr, file=sys.stderr)

    print()
    print("=" * 58)
    print(f"  ⟦SCELLE-{cible}⟧  =  {nom}")
    print("=" * 58)
    print()
    if deja:
        print("(ce nom était déjà marqué livré)")
    print("Il est maintenant en clair dans la vue du tronc.")
    print("À faire : l'inscrire au canon public (monde/POUSSIERE.md) et à l'errata.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
