#!/usr/bin/env python3
"""Simule une partie complète (mêmes règles que le moteur GDScript)
pour garantir que la fin est atteignable avec les gains de stats prévus."""
import json
import sys
from pathlib import Path

STORY = json.loads((Path(__file__).resolve().parent.parent / "data" / "story.json").read_text(encoding="utf-8"))

state = {
    "stats": {"corps": 5, "souffle": 0, "esprit": 5, "perception": 5, "destin": 1},
    "realm": 0, "techniques": [], "items": [], "flags": set(), "secrets": set(),
}

def meets(req):
    for key, val in req.items():
        if key in state["stats"]:
            if state["stats"][key] < val:
                return False
        elif key == "realm":
            if state["realm"] < val:
                return False
        elif key == "realm_max":
            if state["realm"] > val:
                return False
        elif key == "secrets":
            if len(state["secrets"]) < val:
                return False
        elif key == "tech":
            if val not in state["techniques"]:
                return False
        elif key == "flag":
            for fl in (val if isinstance(val, list) else [val]):
                if fl not in state["flags"]:
                    return False
        elif key == "not_flag":
            for fl in (val if isinstance(val, list) else [val]):
                if fl in state["flags"]:
                    return False
    return True

def apply(effects):
    for key, delta in effects.get("stats", {}).items():
        state["stats"][key] += delta
    for fl in effects.get("flags", []):
        state["flags"].add(fl)
    for fl in effects.get("remove_flags", []):
        state["flags"].discard(fl)
    if "tech" in effects and effects["tech"] not in state["techniques"]:
        state["techniques"].append(effects["tech"])
    if "item" in effects and effects["item"] not in state["items"]:
        state["items"].append(effects["item"])
    if "secret_id" in effects:
        state["secrets"].add(effects["secret_id"])
    if "realm" in effects and effects["realm"] > state["realm"]:
        state["realm"] = effects["realm"]

# Une partie « joueur curieux » : entraînements, secrets accessibles, quêtes, fins.
SCRIPT = [
    "Continuer", "Observer sa posture", "Approcher la main", "« ...Parce que la pierre",
    "Contempler la première étincelle", "Commencer ta nouvelle vie",
    # entraînement de base
    "La Cour des Lanternes", "Balayer avec le Souffle", "Continuer",
    "Balayer encore", "Continuer", "Écouter les ragots", "Retenir tout",
    "Retourner sur la place centrale",
    "Les Cuisines", "Porter les sacs", "Manger jusqu'à", "Parler à la fosse", "Recueillir",
    "Retourner sur la place centrale",
    "Le Pavillon", "Recopier des manuels", "Continuer", "Recopier les annales", "Noter la demi-ligne",
    "Étudier les fondements", "Continuer", "La stèle fendue", "Mémoriser le manuel",
    "Retourner sur la place centrale",
    "La Falaise", "Frapper la paroi mille fois", "Continuer",
    "Frapper la paroi les yeux fermés", "Continuer", "Retourner sur la place centrale",
    # stèle de l'entrée (secret perception 6)
    "La vieille stèle", "Graver ces mots",
    # épreuve externe
    "La Salle des Missions", "S'inscrire à l'Épreuve", "Porter la jarre à la force du corps",
    "Recevoir la robe grise", "Endosser la robe grise",
    # duel + servante muette (destin 3 après ragots + robe)
    "La Cour des Lanternes", "Défier un disciple", "Tendre la main",
    "Aider la vieille servante", "La saluer comme on salue", "Retourner sur la place centrale",
    # percée rang 2
    "Méditer en secret", "Percée : ouvrir la Rivière", "Accueillir la Rivière",
    # suite Grand-Père Cendre
    "Les Cuisines", "Retourner voir Grand-Père Cendre", "Durer",
    "Demander à Grand-Père Cendre la suite", "Recevoir la flamme blanche",
    "Jeter un œil au registre", "Cacher les copies", "Retourner sur la place centrale",
    # forêt + herbe de lune
    "La Forêt des Brumes", "Cueillir des herbes", "Continuer", "Cueillir plus profond", "Continuer",
    "T'asseoir immobile", "Retenir l'endroit exact", "L'autel englouti", "Relever la carte céleste",
    "Retourner sur la place centrale",
    "La Salle des Missions", "Mission : rapporter l'Herbe", "S'enfoncer dans la brume",
    "Te fondre dans la brume", "Rentrer avec l'herbe", "Ranger le septième brin",
    # percée rang 3
    "Méditer en secret", "Percée : planter la Racine", "Planter la Racine",
    # falaise secrets tardifs
    "La Falaise", "La vieille épée rouillée", "Répondre :", "Méditer sous la lune noire",
    "Respirer la nuit entière", "Retourner sur la place centrale",
    # tournoi
    "La Salle des Missions", "S'inscrire au Tournoi", "Monter sur l'arène",
    "Encaisser sa charge", "Faire fondre chaque aiguille",
    "Observer ses huit premiers pas", "Nommer le geste",
    "Glisser dans son angle mort", "Recevoir la robe noire", "Dormir ta première nuit",
    # puits secret (perception 11)
    "Les Cuisines", "Le vieux puits scellé", "Descendre dans le noir", "T'incliner neuf fois",
    "Retourner sur la place centrale",
    # convocation + garde
    "La Salle des Missions", "Répondre à la convocation", "Lui parler des piquets",
    "« Personne n'entre", "Te préparer à la tempête",
    # percée rang 4
    "Méditer en secret", "Percée : couler la Fondation", "Couler la Fondation",
    # finale — voie de la droiture, avec fouille de la chambre de Mo
    "La Salle des Missions", "Les cloches de guerre",
    "Fouiller la chambre de l'Ancien Mo", "Descendre vers le Cœur, les preuves",
    "Te dresser entre Mo et le Cœur",
    "« Je suis le gardien", "Éteindre son feu volé", "Contempler ta montagne",
]

node_id = "start"
for step, prefix in enumerate(SCRIPT):
    node = STORY[node_id]
    match = None
    for ch in node.get("choices", []):
        once = ch.get("once")
        if once and once in state["flags"]:
            continue
        if ch["text"].startswith(prefix):
            match = ch
            break
    if match is None:
        print(f"ÉCHEC étape {step}: choix « {prefix} » introuvable dans « {node_id} »")
        sys.exit(1)
    if not meets(match.get("require", {})):
        print(f"ÉCHEC étape {step}: conditions non remplies pour « {prefix} » dans « {node_id} »")
        print(f"  require={match.get('require')} stats={state['stats']} realm={state['realm']} "
              f"secrets={len(state['secrets'])} flags={sorted(state['flags'])}")
        sys.exit(1)
    if match.get("once"):
        state["flags"].add(match["once"])
    apply(match.get("effects", {}))
    node_id = match["goto"]

assert node_id == "epilogue", f"fin inattendue : {node_id}"
print("OK — partie complète jouée jusqu'à l'épilogue (fin « Gardien du Fourneau »).")
print(f"  Stats finales : {state['stats']}")
print(f"  Rang final : {state['realm']} | Secrets : {len(state['secrets'])}/12 | Techniques : {len(state['techniques'])}")
