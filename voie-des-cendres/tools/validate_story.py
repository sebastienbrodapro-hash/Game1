#!/usr/bin/env python3
"""Vérifie l'intégrité du graphe narratif de story.json."""
import json
import sys
from pathlib import Path

STORY = Path(__file__).resolve().parent.parent / "data" / "story.json"

VALID_REQUIRE = {"corps", "souffle", "esprit", "perception", "destin",
                 "realm", "realm_max", "secrets", "tech", "flag", "not_flag"}
VALID_EFFECTS = {"stats", "flags", "remove_flags", "tech", "item", "secret_id", "realm"}
VALID_CHOICE = {"text", "goto", "require", "secret", "once", "effects", "locked_text"}
VALID_NODE = {"text", "choices", "on_enter"}
STATS = {"corps", "souffle", "esprit", "perception", "destin"}
SECRET_TOTAL = 12

def main() -> int:
    story = json.loads(STORY.read_text(encoding="utf-8"))
    errors, warnings = [], []
    secret_ids = set()

    for node_id, node in story.items():
        extra = set(node) - VALID_NODE
        if extra:
            errors.append(f"{node_id}: clés de nœud inconnues {extra}")
        if not node.get("text"):
            errors.append(f"{node_id}: texte manquant")
        for i, ch in enumerate(node.get("choices", [])):
            where = f"{node_id}[{i}]"
            extra = set(ch) - VALID_CHOICE
            if extra:
                errors.append(f"{where}: clés de choix inconnues {extra}")
            goto = ch.get("goto")
            if goto != "__restart" and goto not in story:
                errors.append(f"{where}: goto inexistant « {goto} »")
            for key in ch.get("require", {}):
                if key not in VALID_REQUIRE:
                    errors.append(f"{where}: require inconnu « {key} »")
            eff = ch.get("effects", {})
            for key in eff:
                if key not in VALID_EFFECTS:
                    errors.append(f"{where}: effet inconnu « {key} »")
            for key in eff.get("stats", {}):
                if key not in STATS:
                    errors.append(f"{where}: stat inconnue « {key} »")
            if "secret_id" in eff:
                sid = eff["secret_id"]
                if sid in secret_ids:
                    errors.append(f"{where}: secret_id dupliqué « {sid} »")
                secret_ids.add(sid)

    # Atteignabilité (en ignorant les conditions)
    seen, stack = {"start"}, ["start"]
    while stack:
        node = story.get(stack.pop(), {})
        for ch in node.get("choices", []):
            goto = ch.get("goto")
            if goto and goto != "__restart" and goto not in seen and goto in story:
                seen.add(goto)
                stack.append(goto)
    unreachable = set(story) - seen
    if unreachable:
        errors.append(f"nœuds inatteignables : {sorted(unreachable)}")

    if len(secret_ids) != SECRET_TOTAL:
        errors.append(f"secrets : {len(secret_ids)} trouvés, {SECRET_TOTAL} attendus ({sorted(secret_ids)})")

    for ending in ("ending_droiture", "ending_serpent", "ending_cendres", "epilogue"):
        if ending not in story:
            errors.append(f"fin manquante : {ending}")

    for msg in warnings:
        print(f"AVERTISSEMENT : {msg}")
    if errors:
        for msg in errors:
            print(f"ERREUR : {msg}")
        return 1
    print(f"OK — {len(story)} nœuds, {len(secret_ids)} secrets, tout est atteignable.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
