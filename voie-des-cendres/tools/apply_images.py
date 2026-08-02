#!/usr/bin/env python3
"""Associe chaque nœud du récit à son illustration (clé "image" dans story.json)."""
import json
from pathlib import Path

STORY = Path(__file__).resolve().parent.parent / "data" / "story.json"

MAPPING = {
    "start": "su_han_balai",
    "intro_bai": "humiliation",
    "intro_corvee": "fosse_feu_nuit",
    "intro_braise": "visage_braise",
    "awakening": "eveil_souffle",
    "awakening2": "racines_secretes",
    "hub": "sect_panorama",
    "sec_stele": "stele_moussue",
    "loc_cour": "cour_lanternes",
    "cour_balaye1": "entrainement_balai",
    "cour_balaye2": "entrainement_balai",
    "cour_ragots": "ragots_disciples",
    "cour_duel": "duel_cour",
    "sec_muette": "dame_wen",
    "loc_cuisines": "cuisines",
    "cui_aide": "sacs_riz",
    "gpc1": "lecon_fumees",
    "gpc2": "lecon_braise",
    "gpc3": "paume_suie",
    "sec_registre": "registre_qiu",
    "sec_puits": "puits_scelle",
    "sec_puits2": "ossuaire_fondateur",
    "loc_pavillon": "pavillon_ecritures",
    "pav_copie1": "copie_manuels",
    "pav_copie2": "annales_arrachees",
    "pav_bases": "schema_souffle",
    "sec_stele_fendue": "stele_fendue",
    "sec_aile": "arbre_muhuang",
    "loc_falaise": "falaise_epees",
    "fal_paroi1": "frappe_paroi",
    "fal_paroi2": "frappe_nuit",
    "sec_epee": "murmure_epee",
    "sec_lune": "lune_noire",
    "loc_foret": "foret_brumes",
    "for_herbes1": "cueillette",
    "for_herbes2": "brume_profonde",
    "for_guet": "biche_spirituelle",
    "for_lievre": "lievre_cornu",
    "sec_autel": "autel_englouti",
    "sec_rossignol": "rossignol_nid",
    "loc_missions": "salle_missions",
    "q1_intro": "jarre_epreuve",
    "q1_eau": "mille_marches",
    "q1_succes": "robe_grise",
    "q2_intro": "foret_brumes",
    "q2_brume": "combe_argentee",
    "q2_espion": "espion_grue",
    "q2_retour": "retour_herbe",
    "t_intro": "arene_tournoi",
    "t_r1": "colosse_wu",
    "t_r2": "aiguilles_givre",
    "t_bai_intro": "bai_feng",
    "t_bai_secret": "pas_boiteux",
    "t_bai_fight": "duel_tempete",
    "t_bai_win": "victoire_arene",
    "t_bai_lose": "defaite_poussiere",
    "t_epilogue": "robe_noire",
    "q4_maitre": "maitre_yuan",
    "q4_garde": "porte_bronze",
    "q4_mo": "mo_lanterne",
    "f_invasion": "nuit_cloches",
    "f_mo_chambre": "chambre_mo",
    "f_choix": "coeur_braise",
    "f_melee": "melee",
    "f_droiture1": "mo_transfigure",
    "f_droiture2": "duel_final",
    "ending_droiture": "manteau_cendre",
    "f_serpent1": "preuves_au_vent",
    "ending_serpent": "traite_grue",
    "f_cendres1": "entree_coeur",
    "ending_cendres": "renaissance_cendres",
    "epilogue": "carte_celeste",
    "loc_meditation": "grotte_cascade",
    "med_calme": "meditation_calme",
    "med_r2": "percee_riviere",
    "med_r3": "percee_racine",
    "med_r4": "percee_fondation",
}

def main() -> None:
    story = json.loads(STORY.read_text(encoding="utf-8"))
    missing = [n for n in story if n not in MAPPING]
    if missing:
        print(f"Nœuds sans image : {missing}")
    for node_id, image in MAPPING.items():
        if node_id not in story:
            raise SystemExit(f"Nœud inconnu dans le mapping : {node_id}")
        node = story[node_id]
        # Réinsère "image" juste après "text" pour garder un JSON lisible.
        rebuilt = {}
        for key, val in node.items():
            rebuilt[key] = val
            if key == "text":
                rebuilt["image"] = image
        if "image" not in rebuilt:
            rebuilt["image"] = image
        story[node_id] = rebuilt
    STORY.write_text(json.dumps(story, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"OK — {len(MAPPING)} nœuds illustrés.")

if __name__ == "__main__":
    main()
