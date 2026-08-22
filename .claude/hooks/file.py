#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
LA FILE DU JOUEUR — l'outil qui porte l'engagement, pas la mémoire du MJ.

Raison d'être (joueur, 2026-08-22, après quatre comblements silencieux dans
la même session) : quand le joueur enchaîne des options — « 1 puis 4 »,
« 124 » —, ce n'est pas une préférence, c'est une FILE. Elle se joue à la
suite, une scène par entrée, SANS qu'il ait à la rechoisir. Le MJ avait la
file écrite sous les yeux et a quand même resservi un bloc : le gabarit
« une scène finit par un bloc » a battu l'état.

FONDATION §0 : « une règle qu'on peut oublier doit être portée par un
outil, pas par la mémoire. » Celle-ci l'est. Le hook Stop refuse la sortie
(code 2) si un bloc d'options part alors que la file n'est pas vide.

Usage :
  file.py --pose 1 4      pose la file (remplace la précédente)
  file.py --consomme      l'option en tête est JOUÉE : on la retire
  file.py --suite         l'option en tête se joue sur plusieurs messages
                          (combat en échanges, boutique) : les blocs
                          redeviennent légitimes jusqu'au --consomme
  file.py --etat          affiche la file
  file.py --vide          vide tout (le joueur change de programme)

L'état vit dans .claude/file-etat.json, non versionné : c'est de l'état de
séance, comme psy-etat.txt.
"""
import json
import sys
from pathlib import Path

ETAT = Path(__file__).resolve().parents[2] / ".claude" / "file-etat.json"


def charger() -> dict:
    try:
        d = json.loads(ETAT.read_text(encoding="utf-8"))
        return {"file": list(d.get("file", [])), "suite": bool(d.get("suite"))}
    except Exception:  # noqa: BLE001 — jamais bloquer le jeu sur l'outil
        return {"file": [], "suite": False}


def sauver(d: dict) -> None:
    ETAT.parent.mkdir(parents=True, exist_ok=True)
    ETAT.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")


def rendu(d: dict) -> str:
    if not d["file"]:
        return "file VIDE — un bloc d'options est légitime."
    tete = d["file"][0]
    reste = ", ".join(str(x) for x in d["file"])
    marque = " (en cours, suite déclarée)" if d["suite"] else ""
    return (
        f"file : {reste}{marque}\n"
        f"  -> prochaine scène : l'option {tete}. "
        "Tant que la file n'est pas vide, la scène suivante est DÉJÀ décidée : "
        "aucun bloc ne se compose."
    )


def main(argv: list[str]) -> int:
    if not argv:
        print(rendu(charger()))
        return 0
    cmd, args = argv[0], argv[1:]
    d = charger()

    if cmd == "--pose":
        if not args:
            print("--pose exige au moins une option (ex. --pose 1 4)")
            return 1
        d = {"file": args, "suite": False}
        sauver(d)
        print("file posée — " + rendu(d))
    elif cmd == "--consomme":
        if d["file"]:
            joue = d["file"].pop(0)
            d["suite"] = False
            sauver(d)
            print(f"option {joue} jouée et retirée — " + rendu(d))
        else:
            print("rien à consommer — " + rendu(d))
    elif cmd == "--suite":
        if not d["file"]:
            print("file vide : --suite n'a pas d'objet.")
            return 0
        d["suite"] = True
        sauver(d)
        print("suite déclarée — " + rendu(d))
    elif cmd == "--vide":
        sauver({"file": [], "suite": False})
        print("file vidée.")
    elif cmd == "--etat":
        print(rendu(d))
    else:
        print(f"commande inconnue : {cmd}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
