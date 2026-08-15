#!/usr/bin/env python3
"""jet.py — le tirage d100 du Creuset. LE NATUREL NE S'IMPRIME JAMAIS.

Usage : python .claude/hooks/jet.py [modificateur] [étiquette...]
        python .claude/hooks/jet.py -15 "franchir le mur, de nuit"

Sort : la bande (lue au TOTAL), la ligne JETONS (suit la bande, errata §46),
le mouvement de porte (au NATUREL seul, errata §35/§41). Rien d'autre —
ni le naturel, ni le total : le MJ lui-même ne les voit pas.

Errata §46 : « une règle qu'on peut oublier doit être portée par l'outil,
pas par la mémoire. » D'où ce fichier VERSIONNÉ — le script du scratchpad
mourait à chaque session, et chaque réécriture de mémoire était le vecteur
exact de la faute jetons.
"""
import secrets
import sys


def main() -> None:
    # Console Windows en cp1252 : on force l'UTF-8 sans jamais planter —
    # un tirage qui meurt à l'affichage est un tirage qu'on refait, et
    # un tirage qu'on refait n'est plus un tirage.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except AttributeError:
        pass
    mod = 0
    args = sys.argv[1:]
    if args:
        try:
            mod = int(args[0])
            args = args[1:]
        except ValueError:
            pass
    etiquette = " ".join(args)

    naturel = secrets.randbelow(100) + 1
    total = max(1, min(100, naturel + mod))

    if total <= 10:
        bande, jetons = "01-10 — minimum vital de l'intention", 2
    elif total <= 35:
        bande, jetons = "11-35 — version réduite + une complication", 1
    elif total <= 65:
        bande, jetons = "36-65 — obtenu, à un prix (joué dans la prose)", 0
    elif total <= 89:
        bande, jetons = "66-89 — pleinement, sans prix", 0
    else:
        bande, jetons = "90-100 — au-delà", 0

    if naturel <= 10:
        porte = ("CATASTROPHE (naturel) — une porte NÉGATIVE s'ouvre ou "
                 "s'aggrave d'un cran, DUE DANS LA SCÈNE MÊME (§41)")
    elif naturel >= 90:
        porte = ("TRIOMPHE (naturel) — une porte positive s'ouvre ou monte "
                 "d'un cran, DUE DANS LA SCÈNE MÊME (§27)")
    else:
        porte = "aucun mouvement de porte"
        if total >= 90:
            porte += " · petit plus dans la conséquence (total >= 90, §35)"
        elif total <= 10:
            porte += " · conséquence plus mauvaise (total <= 10, §35)"

    if etiquette:
        print(f"— {etiquette} (mod {mod:+d})")
    print(f"BANDE  : {bande}")
    print(f"JETONS : +{jetons}")
    print(f"PORTE  : {porte}")


if __name__ == "__main__":
    main()
