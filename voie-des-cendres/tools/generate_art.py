#!/usr/bin/env python3
"""Génère les illustrations du jeu via l'API Replicate (FLUX dev).

Usage : generate_art.py [samples|all|nom1,nom2,...] [--force]

Lit tools/art_prompts.json, génère chaque image manquante de la sélection
et l'écrit dans art/<nom>.png. La clé API est lue dans la variable
d'environnement REPLICATE_API_TOKEN (secret GitHub Actions, jamais commité).
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ART_DIR = ROOT / "art"
PROMPTS = json.loads((ROOT / "tools" / "art_prompts.json").read_text(encoding="utf-8"))
API = "https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions"
SAMPLES = ["su_han_portrait", "su_han_balai", "visage_braise", "duel_final"]


def call(url: str, payload=None, prefer_wait=False):
    headers = {"Authorization": "Bearer " + os.environ["REPLICATE_API_TOKEN"]}
    data = None
    if payload is not None:
        data = json.dumps(payload).encode()
        headers["Content-Type"] = "application/json"
    if prefer_wait:
        headers["Prefer"] = "wait=60"
    req = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(req, timeout=120) as resp:
        return json.load(resp)


def generate(name: str) -> bool:
    spec = PROMPTS[name]
    # Seed stable par image : relancer le workflow redonne la même composition.
    seed = int.from_bytes(name.encode(), "big") % 1_000_000
    pred = call(API, {"input": {
        "prompt": spec["prompt"],
        "aspect_ratio": spec["aspect_ratio"],
        "output_format": "png",
        "output_quality": 100,
        "disable_safety_checker": True,
        "num_inference_steps": 40,
        "guidance": 3.5,
        "seed": seed,
    }}, prefer_wait=True)

    while pred["status"] not in ("succeeded", "failed", "canceled"):
        time.sleep(3)
        pred = call(pred["urls"]["get"])
    if pred["status"] != "succeeded":
        print(f"  ECHEC {name}: {pred.get('error')}")
        return False

    output = pred["output"]
    url = output[0] if isinstance(output, list) else output
    with urllib.request.urlopen(url, timeout=120) as resp:
        data = resp.read()
    if len(data) < 20_000:
        print(f"  ECHEC {name}: fichier suspect ({len(data)} octets)")
        return False
    (ART_DIR / f"{name}.png").write_bytes(data)
    print(f"  OK {name} ({len(data) // 1024} Ko)")
    return True


def main() -> int:
    if not os.environ.get("REPLICATE_API_TOKEN"):
        print("ERREUR : REPLICATE_API_TOKEN absent (secret GitHub non configuré ?)")
        return 1
    args = [a for a in sys.argv[1:] if a != "--force"]
    force = "--force" in sys.argv
    selection = args[0] if args else "samples"
    if selection == "all":
        names = list(PROMPTS)
    elif selection == "samples":
        names = SAMPLES
    else:
        names = [n.strip() for n in selection.split(",") if n.strip()]
    unknown = [n for n in names if n not in PROMPTS]
    if unknown:
        print(f"ERREUR : noms inconnus {unknown}")
        return 1
    if not force:
        names = [n for n in names if not (ART_DIR / f"{n}.png").exists()]
    print(f"{len(names)} image(s) à générer")

    failures = 0
    for i, name in enumerate(names, 1):
        print(f"[{i}/{len(names)}] {name}")
        try:
            if not generate(name):
                failures += 1
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            # Une erreur réseau ponctuelle ne doit pas perdre le travail déjà fait.
            print(f"  ECHEC {name}: {e}")
            failures += 1
        time.sleep(1)

    if failures:
        print(f"{failures} échec(s) — les images réussies sont conservées")
    return 1 if failures and failures == len(names) else 0


if __name__ == "__main__":
    sys.exit(main())
