#!/usr/bin/env python3
"""Vérifie que chaque SVG de art/ est valide et compatible ThorVG (rendu Godot)."""
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ART_DIR = Path(__file__).resolve().parent.parent / "art"

FORBIDDEN_TAGS = {"filter", "text", "image", "mask", "clipPath", "use", "style",
                  "animate", "animateTransform", "animateMotion", "pattern",
                  "foreignObject", "switch", "symbol", "marker", "textPath", "tspan"}

def main() -> int:
    errors = []
    files = sorted(ART_DIR.glob("*.svg"))
    if not files:
        print("ERREUR : aucun SVG dans art/")
        return 1
    for path in files:
        content = path.read_text(encoding="utf-8")
        try:
            root = ET.fromstring(content)
        except ET.ParseError as exc:
            errors.append(f"{path.name}: XML invalide ({exc})")
            continue
        if not root.tag.endswith("svg"):
            errors.append(f"{path.name}: racine inattendue {root.tag}")
            continue
        viewbox = root.get("viewBox", "")
        expected = "0 0 512 512" if path.stem == "su_han_portrait" else "0 0 1024 512"
        if viewbox.strip() != expected:
            errors.append(f"{path.name}: viewBox « {viewbox} » (attendu « {expected} »)")
        for elem in root.iter():
            tag = elem.tag.split("}")[-1]
            if tag in FORBIDDEN_TAGS:
                errors.append(f"{path.name}: élément interdit <{tag}>")
                break
            if elem.get("style"):
                errors.append(f"{path.name}: attribut style interdit sur <{tag}>")
                break
        if len(content) < 1500:
            errors.append(f"{path.name}: suspicieusement petit ({len(content)} octets)")
    if errors:
        for msg in errors:
            print(f"ERREUR : {msg}")
        return 1
    total_kb = sum(p.stat().st_size for p in files) // 1024
    print(f"OK — {len(files)} SVG valides et compatibles ThorVG ({total_kb} Ko au total).")
    return 0

if __name__ == "__main__":
    sys.exit(main())
