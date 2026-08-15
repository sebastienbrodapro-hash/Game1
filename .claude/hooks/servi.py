#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
servi.py — déclarer au compteur ce que la scène vient de servir.

    python .claude/hooks/servi.py 12 bete porte equipement
    python .claude/hooks/servi.py --etat          # où en sont les compteurs
    python .claude/hooks/servi.py --reset         # repart de zéro (nouveau jeu)
    python .claude/hooks/servi.py --axes          # la liste et les seuils

Se lance APRÈS avoir écrit la scène, avant de rendre la main. N'imprime que
des comptes : rien de tout ça ne s'affiche au joueur (errata §36).
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import axes as A  # noqa: E402

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except AttributeError:
    pass


def montrer(etat: dict) -> None:
    """Retard et cadence NOMINALE seulement.

    Le seuil effectif du cycle (base ±20 %) n'est jamais montré : le lire,
    ce serait retrouver le métronome que le jitter vient de supprimer.
    """
    scene = etat.get("scene", 0)
    print(f"scene courante : {scene}")
    for axe, (base, libelle, _) in sorted(
        A.AXES.items(), key=lambda kv: kv[1][0]
    ):
        dernier = etat["servi"].get(axe, 0)
        retard = scene - dernier if dernier else scene
        esc = etat["escalade"].get(axe, 0)
        # marge basse du jitter : au-dela, ca PEUT sonner a tout moment
        plancher = base if base < A.JITTER_MINI else round(base * (1 - A.JITTER))
        etiquette = "ok " if retard <= plancher else "..."
        marque = f" · escalade {esc}" if esc else ""
        print(
            f"  {etiquette} {axe:<13} retard {retard:>3} / cadence ~{base:<2}"
            f"  ({libelle}){marque}"
        )
    print("\n(« ... » = dans la zone ou ca peut sonner. Le seuil exact du cycle")
    print("  est tire a +/-20% et n'est pas affiche : servir quand la scene s'y prete.)")


def main() -> int:
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__.strip())
        return 0

    if args[0] == "--axes":
        for axe, (seuil, libelle, quoi) in sorted(
            A.AXES.items(), key=lambda kv: kv[1][0]
        ):
            print(f"{axe:<13} seuil {seuil:>2}  {libelle}\n              {quoi}")
        return 0

    if args[0] == "--reset":
        A.sauver(A._vide())
        print("compteurs remis a zero.")
        return 0

    etat = A.charger()

    if args[0] == "--etat":
        montrer(etat)
        return 0

    if not args[0].isdigit():
        print("premier argument : le numero de la scene.", file=sys.stderr)
        return 1

    scene = int(args[0])
    demandes = args[1:]
    if not demandes:
        print("rien a declarer : donner au moins un axe.", file=sys.stderr)
        return 1

    inconnus = [a for a in demandes if a.strip().lower() not in A.AXES]
    connus = A.declarer(etat, scene, demandes)
    A.sauver(etat)

    print(f"scene {scene} — servis : {', '.join(connus) if connus else 'aucun'}")
    if inconnus:
        print(f"IGNORES (axe inconnu) : {', '.join(inconnus)}")
    en_retard = [
        a for a, (s, _, _) in A.AXES.items()
        if scene - etat["servi"].get(a, 0) > s
    ]
    print(f"en retard : {', '.join(sorted(en_retard)) if en_retard else 'aucun'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
