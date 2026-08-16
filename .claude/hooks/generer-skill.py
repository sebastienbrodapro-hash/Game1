#!/usr/bin/env python3
"""⛔ NEUTRALISÉ — generer-skill.py fabriquait le skill `creuset`.

**Le skill `creuset` appartient à la campagne close** (Le Creuset, scène 299).
Le relancer réinstallerait dans `~/.claude/skills/creuset/` un skill qui se
déclenche sur le vocabulaire de la campagne courante — Seb, la bête, un cran,
une porte, un jet, un bloc, un codex — et qui y injecte des règles mortes :
l'échelle en six crans de l'ancienne bête, le Masque, les grades de Corps du
Creuset, un protocole de lecture qui pointe vers `archive/`.

C'est exactement la faute que l'archivage du 2026-08-16 supprime. **Le script
refuse donc de tourner** : il n'est conservé que pour l'histoire du dépôt.

Si un jour la campagne courante veut son propre skill, ce sera un autre
générateur, avec son propre frontmatter — pas celui-ci.

Sources d'origine (déplacées) : `archive/creuset/SKILL-FRONT.md`,
`archive/creuset/codexcreuset.md`, `archive/creuset/INDEX.md`.
Sources restées vivantes : `codex/RULE-MJ.md`, `codex/SEUILS.md`.
"""
import re
import sys
import zipfile
from datetime import date
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
ARCHIVE = RACINE / "archive" / "creuset"
CODEX = ARCHIVE / "codexcreuset.md"
INDEX = ARCHIVE / "INDEX.md"
FRONT = ARCHIVE / "SKILL-FRONT.md"
RULE = RACINE / "codex" / "RULE-MJ.md"
SEUILS = RACINE / "codex" / "SEUILS.md"
BUILD = RACINE / "build" / "skill-creuset"
ZIP = RACINE / "build" / "creuset.zip"
SKILLS_LOCAL = Path.home() / ".claude" / "skills" / "creuset"


def estampille() -> str:
    codex_txt = CODEX.read_text(encoding="utf-8")
    v = re.search(r"\(v(\d+)\)", codex_txt)
    sc = re.search(r"Sc[eè]ne (\d+)", codex_txt)
    tags = re.findall(r"codex-(\d{3})", INDEX.read_text(encoding="utf-8"))
    dernier = f"codex-{max(tags)}" if tags else "codex-???"
    version = f"v{v.group(1)}" if v else "v?"
    scene = f"scene {sc.group(1)}" if sc else "scene ?"
    return f"{dernier} · {version} · {scene} · générée le {date.today().isoformat()}"


def main() -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except AttributeError:
        pass

    print(
        "NEUTRALISÉ — le skill `creuset` appartient à la campagne close.\n"
        "Le régénérer réinstallerait des règles mortes qui se déclenchent sur\n"
        "le vocabulaire de la campagne courante. Voir l'en-tête du fichier.",
        file=sys.stderr,
    )
    sys.exit(1)

    stamp = estampille()
    front = FRONT.read_text(encoding="utf-8").replace("{{STAMP}}", stamp)
    rule = RULE.read_text(encoding="utf-8")
    skill_md = front.rstrip() + "\n\n" + rule

    refs = BUILD / "references"
    refs.mkdir(parents=True, exist_ok=True)
    (BUILD / "SKILL.md").write_text(skill_md, encoding="utf-8", newline="\n")
    seuils_octets = SEUILS.read_bytes()
    (refs / "SEUILS.md").write_bytes(seuils_octets)

    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(BUILD / "SKILL.md", "creuset/SKILL.md")
        z.write(refs / "SEUILS.md", "creuset/references/SEUILS.md")

    # L'installation, pas la livraison : le skill local EST ce dossier.
    refs_local = SKILLS_LOCAL / "references"
    refs_local.mkdir(parents=True, exist_ok=True)
    (SKILLS_LOCAL / "SKILL.md").write_text(skill_md, encoding="utf-8", newline="\n")
    (refs_local / "SEUILS.md").write_bytes(seuils_octets)

    identique = (refs / "SEUILS.md").read_bytes() == seuils_octets
    installe = ((SKILLS_LOCAL / "SKILL.md").read_text(encoding="utf-8") == skill_md
                and (refs_local / "SEUILS.md").read_bytes() == seuils_octets)
    print(f"estampille           : {stamp}")
    print(f"SKILL.md             : {len(skill_md.encode('utf-8'))} octets "
          f"(front {len(front.encode('utf-8'))} + RULE-MJ verbatim {len(rule.encode('utf-8'))})")
    print(f"references/SEUILS.md : {len(seuils_octets)} octets · "
          f"identique octet pour octet a codex/SEUILS.md : {identique}")
    print(f"INSTALLE             : {SKILLS_LOCAL} · conforme : {installe}")
    print(f"zip pour l'app       : {ZIP}")
    if not (identique and installe):
        sys.exit(1)


if __name__ == "__main__":
    main()
