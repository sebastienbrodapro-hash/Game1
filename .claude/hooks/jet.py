#!/usr/bin/env python3
"""jet.py — le tirage d100. LE NATUREL NE S'IMPRIME JAMAIS.

Usage : python .claude/hooks/jet.py [modificateur] [étiquette...]
        python .claude/hooks/jet.py -15 "franchir le mur, de nuit"
        python .claude/hooks/jet.py -15 --jetons "franchir le mur, de nuit"

Sort : la bande (lue au TOTAL), la ligne JETONS (suit la bande, errata §46),
le mouvement de porte (au NATUREL seul, errata §35/§41). Rien d'autre —
ni le naturel, ni le total : le MJ lui-même ne les voit pas.

`--jetons` : la dépense de 5 jetons, déclarée AVANT le jet (refonte tranchée
par le joueur le 2026-08-16). Deux dés sont lancés, **le meilleur TOTAL est
gardé automatiquement**, et c'est ce dé-là qui paie ET qui ouvre : si son
naturel est critique, la porte tombe ; si c'est l'autre dé qui l'avait, elle
est perdue. Pas d'empilement : 5 jetons = 2 dés, quel que soit le stock.
Le dé écarté ne s'affiche pas — l'afficher renseignerait sur un naturel.

Errata §46 : « une règle qu'on peut oublier doit être portée par l'outil,
pas par la mémoire. » D'où ce fichier VERSIONNÉ — le script du scratchpad
mourait à chaque session, et chaque réécriture de mémoire était le vecteur
exact de la faute jetons.
"""
import secrets
import sys


def tirer(mod: int) -> tuple[int, int]:
    """Un dé : rend (naturel, total). Le total est borné à 1-100."""
    naturel = secrets.randbelow(100) + 1
    return naturel, max(1, min(100, naturel + mod))


def lire(naturel: int, total: int) -> tuple[str, int, str]:
    """Rend (bande, jetons gagnés, mouvement de porte) pour un dé donné."""
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

    return bande, jetons, porte


def main() -> None:
    # Console Windows en cp1252 : on force l'UTF-8 sans jamais planter —
    # un tirage qui meurt à l'affichage est un tirage qu'on refait, et
    # un tirage qu'on refait n'est plus un tirage.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except AttributeError:
        pass

    args = [a for a in sys.argv[1:] if a != "--jetons"]
    double = len(args) != len(sys.argv[1:])

    mod = 0
    if args:
        try:
            mod = int(args[0])
            args = args[1:]
        except ValueError:
            pass
    etiquette = " ".join(args)

    if double:
        # Le meilleur TOTAL l'emporte, et ce dé-là paie ET ouvre.
        # Départage au naturel : sur un gros modificateur le total se borne
        # à 1 ou 100, et deux naturels très différents rendent alors le même
        # total — dont un critique. À total égal, le naturel le plus haut
        # gagne : ça attrape le 90-100 et ça écarte le 01-10.
        naturel, total = max((tirer(mod), tirer(mod)),
                             key=lambda d: (d[1], d[0]))
    else:
        naturel, total = tirer(mod)

    bande, jetons, porte = lire(naturel, total)

    if etiquette:
        print(f"— {etiquette} (mod {mod:+d})")
    if double:
        print("DÉS    : 2 — 5 jetons dépensés, meilleur total gardé")
    print(f"BANDE  : {bande}")
    print(f"JETONS : +{jetons}")
    print(f"PORTE  : {porte}")


if __name__ == "__main__":
    main()
