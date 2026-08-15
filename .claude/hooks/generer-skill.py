#!/usr/bin/env python3
"""generer-skill.py — refabrique le skill `creuset` depuis le dépôt.

Source unique (le dépôt gagne toujours) :
  codex/SKILL-FRONT.md  — frontmatter + protocole du skill (placeholder {{STAMP}})
  codex/RULE-MJ.md      — la carte de conduite, copiée VERBATIM (aucune reformulation)
  codex/SEUILS.md       — copié OCTET POUR OCTET vers references/SEUILS.md

Sortie : build/skill-creuset/ (SKILL.md + references/SEUILS.md) et build/creuset.zip,
à présenter au joueur pour installation. N'imprime que des comptes.

Un générateur qui reformule fabrique un troisième texte que personne ne relit —
celui-ci copie, estampille, et c'est tout.
"""
import re
import sys
import zipfile
from datetime import date
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
CODEX = RACINE / "codexcreuset.md"
INDEX = RACINE / "codex" / "INDEX.md"
FRONT = RACINE / "codex" / "SKILL-FRONT.md"
RULE = RACINE / "codex" / "RULE-MJ.md"
SEUILS = RACINE / "codex" / "SEUILS.md"
BUILD = RACINE / "build" / "skill-creuset"
ZIP = RACINE / "build" / "creuset.zip"


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

    identique = (refs / "SEUILS.md").read_bytes() == seuils_octets
    print(f"estampille           : {stamp}")
    print(f"SKILL.md             : {len(skill_md.encode('utf-8'))} octets "
          f"(front {len(front.encode('utf-8'))} + RULE-MJ verbatim {len(rule.encode('utf-8'))})")
    print(f"references/SEUILS.md : {len(seuils_octets)} octets · "
          f"identique octet pour octet a codex/SEUILS.md : {identique}")
    print(f"-> {ZIP}")
    if not identique:
        sys.exit(1)


if __name__ == "__main__":
    main()
