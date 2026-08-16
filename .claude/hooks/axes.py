#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AXES — le compteur de ce qui n'est PAS servi.

Raison d'être, dite par le joueur le 2026-08-15, après qu'un cinquième de
campagne eut été construit sur des axes jamais servis :

    « on a discuté de tout ce qui ne va pas et pourtant tu n'as pas suivi. »

Le diagnostic n'est pas la mémoire, c'est l'omission. Le MJ n'oublie pas la
règle « sers l'équipement » : il ne la coche jamais, et RIEN ne compte ce qui
n'est pas servi. Un fichier peut dire « il faut des chances » ; aucun fichier
ne peut dire « ça fait 111 scènes que tu n'en as pas servi une ».

Ce module le dit.

MODÈLE — safe by default : le MJ DÉCLARE ce qu'il a servi (`servi.py`).
Ne rien déclarer fait monter les compteurs et finit par sonner. L'oubli
produit donc une alerte, jamais un silence. C'est tout le principe.

ESCALADE (tranchée par le joueur, 2026-08-15) — une scène peut légitimement
ne pas porter un axe (errata §21 : l'option Corps ne se force pas), donc on
ne bloque pas au premier dépassement :

    1re sonnerie          -> NOTE            (on signale, rien de plus)
    2e et 3e sonneries    -> ATTENTION FORTE (sers-le, sauf si le lieu l'interdit)
    4e et au-delà         -> ALERTE          (sers-le maintenant, avant la main)

Entre deux sonneries d'un même axe : PAS_SONNERIE scènes de silence. Un hook
qui redemande à chaque tour est un hook qu'on éteint (errata, cadence psy).

Servir un axe remet son escalade à zéro.

JITTER (tranché par le joueur, 2026-08-15) — un seuil fixe se joue au
métronome : le MJ sert l'équipement pile à la scène 10 et la chance pile à
la 12, et le compteur devient un calendrier qu'on contourne au lieu d'une
pression qu'on subit. Chaque seuil est donc tiré à **±20 %**, UNE FOIS PAR
CYCLE (au moment où l'axe est servi), et jamais affiché : le MJ ne sait pas
quand ça va sonner, donc il sert quand la scène s'y prête.

Les seuils de 1 ou 2 ne bougent pas : ce sont des règles dures (la bête à
chaque scène, une bifurcation par bloc), pas des cadences.
"""
from __future__ import annotations

import json
import random
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
ETAT = RACINE / ".claude" / "axes-etat.json"

PAS_SONNERIE = 3  # scènes de silence entre deux sonneries d'un même axe
JITTER = 0.20     # ±20 % sur chaque seuil, retiré à chaque service
JITTER_MINI = 3   # en dessous, le seuil est une règle dure : pas de tirage
SEUIL_GEL = 12    # scènes de gel tolérées avant que le gel lui-même sonne

# axe -> (scènes de retard tolérées, libellé, ce qu'il faut faire)
AXES: dict[str, tuple[int, str, str]] = {
    "bete": (
        1, "LA BÊTE EN SCÈNE",
        "jamais du décor, au minimum une ligne par scène. **Mais 'jamais du "
        "décor' ≠ 'une volonté propre'** (FONDATION §3.5) : avant le palier "
        "C, l'axe se sert par ce que le MONDE lui fait — on la moque, on la "
        "jauge, on l'écarte, on parie sur elle — et par ce qu'elle fait "
        "d'animal. Lui prêter des intentions avant l'heure est une faute au "
        "même titre que la laisser en décor. Après C : elle veut, elle "
        "refuse, elle argumente",
    ),
    "sortie_plan": (
        1, "UNE OPTION QUI SORT DU PLAN",
        "errata §43, à CHAQUE bloc : un bloc dont toutes les sorties donnent "
        "sur la même pièce est un couloir, pas un choix",
    ),
    "porte": (
        8, "MOUVEMENT DE PORTE",
        "un cran, une ouverture, une aggravation — et toute porte due à un "
        "critique se sert dans la scène même (§27)",
    ),
    "noir": (
        8, "OPTION NOIRE",
        "à proposer régulièrement, en montant en dureté, jamais moralisée "
        "en scène",
    ),
    "arrogance": (
        8, "QUELQU'UN QUI LE PREND DE HAUT",
        "on vient à lui avec mépris, condescendance ou provocation — le "
        "carburant de la domination (§42 : elle se joue en UNE scène, mais "
        "encore faut-il qu'on la lui serve). Faute du 2026-08-15 : réclamé "
        "explicitement, servi trop peu",
    ),
    "mesure": (
        10, "UNE MESURE — il SUBIT une lecture",
        "le monde lit un chiffre sur lui sans qu'il ait rien à faire : une "
        "pierre qui affiche, un autel qui rend, quelqu'un qui l'estime tout "
        "haut, un rang qu'on lui colle. Il n'agit pas, on le lit — et ce "
        "qu'on lit peut être faux, humiliant ou fracassant. **Ne pas "
        "confondre avec `rite`** : son instinct à lui ne compte jamais (il "
        "est gratuit et permanent), et avoir servi un rite ne dispense pas "
        "d'une mesure",
    ),
    "corps": (
        10, "LE CORPS",
        "une occasion d'épreuve, là où le lieu et le moment la portent "
        "(§12/§21) — jamais forcée",
    ),
    "art": (
        10, "LES ARTS",
        "un art nommé qui progresse, s'acquiert, se vole ou sert vraiment "
        "en scène",
    ),
    "equipement": (
        10, "L'ÉQUIPEMENT",
        "armes, armures, pilules, objets — réel et important, et il en veut "
        "(§33). Faute du 2026-08-15 : 111 scènes sans un seul objet à lui",
    ),
    "marchandage": (
        10, "L'ÉCONOMIE",
        "un prix, une vente, un échange, une bourse qui bouge — POUSSIERE §4. "
        "Faute du 2026-08-15 : 111 scènes à zéro fer sans une transaction",
    ),
    "atout": (
        12, "LIGNE ⚑ ATOUT",
        "seulement quand il pèse vraiment (§36), mais pas jamais — et varier "
        "les personnes (§18)",
    ),
    "chance": (
        12, "UNE CHANCE",
        "POUSSIERE §6 : la strate est trouée d'épreuves à gain propre. Faute "
        "du 2026-08-15 : une seule servie en 111 scènes",
    ),
    "rite": (
        15, "UN RITE — il PASSE une épreuve",
        "quelque chose de codifié qu'il traverse en produisant un effort : "
        "un tripode à porter, un concours, une épreuve d'entrée, un passage "
        "devant une secte (POUSSIERE §8 — la pile de l'ancien monde est "
        "interdite de retour). Un cadre, des témoins, un résultat qu'IL "
        "fabrique. **Ne pas confondre avec `mesure`** : dans un rite il "
        "agit, dans une mesure on le lit. Un rite peut finir par une mesure, "
        "jamais l'inverse. Faute du 2026-08-15 : deux en 111 scènes, et "
        "c'était deux fois la même pile",
    ),
    "grosse_piece": (
        15, "LA GROSSE PIÈCE",
        "une proie unique, terrée, qui rend coup pour coup — sommet de "
        "plaisir déclaré du joueur (§30)",
    ),
    "reclusion": (
        30, "LA RÉCLUSION",
        "servie ou rendue accessible — un cran d'art, une couche, un cran "
        "d'elle, et le monde qui bouge sans lui (§33)",
    ),
}

NIVEAUX = {
    1: ("NOTE", "Rien à faire si la scène ne s'y prête pas. C'est un signalement."),
    2: ("ATTENTION FORTE", "À servir au prochain bloc, sauf si le lieu l'interdit vraiment."),
    4: ("⛔ ALERTE", "À SERVIR MAINTENANT, avant de rendre la main. Le retard n'est plus une circonstance, c'est une dérive."),
}


def _vide() -> dict:
    return {
        "scene": 0, "servi": {}, "escalade": {}, "sonnerie": {},
        "seuil": {}, "gel": {},
    }


def geler(etat: dict, scene: int, axes: list[str]) -> list[str]:
    """Suspend des axes que le lieu rend impossibles (sommet désert, mer,
    cachot, marche de vingt jours). Le gel NE SUPPRIME PAS le compteur : il
    l'arrête, et il est lui-même compté — au-delà de SEUIL_GEL scènes, c'est
    le gel qui sonne. Un lieu où l'économie est impossible pendant quinze
    scènes n'est pas une circonstance, c'est une composition à corriger.
    """
    faits = []
    for a in axes:
        a = a.strip().lower()
        if a in AXES:
            etat.setdefault("gel", {}).setdefault(a, scene)
            faits.append(a)
    return faits


def degeler(etat: dict, axes: list[str] | None = None) -> list[str]:
    gel = etat.setdefault("gel", {})
    cibles = [a.strip().lower() for a in axes] if axes else list(gel)
    faits = [a for a in cibles if gel.pop(a, None) is not None]
    return faits


def tirer_seuil(axe: str) -> int:
    """Seuil effectif de ce cycle : base ±20 %, sauf règles dures.

    Tiré au service, gardé jusqu'au service suivant, jamais affiché.
    """
    base = AXES[axe][0]
    if base < JITTER_MINI:
        return base
    bas, haut = base * (1 - JITTER), base * (1 + JITTER)
    return max(1, round(random.uniform(bas, haut)))


def seuil_courant(etat: dict, axe: str) -> int:
    """Seuil de ce cycle ; le tire et le fixe s'il n'existe pas encore."""
    val = etat.setdefault("seuil", {}).get(axe)
    if not isinstance(val, int) or val < 1:
        val = tirer_seuil(axe)
        etat["seuil"][axe] = val
    return val


def charger() -> dict:
    if not ETAT.exists():
        return _vide()
    try:
        etat = json.loads(ETAT.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return _vide()
    base = _vide()
    base.update({k: v for k, v in etat.items() if k in base})
    return base


def sauver(etat: dict) -> None:
    ETAT.parent.mkdir(parents=True, exist_ok=True)
    ETAT.write_text(
        json.dumps(etat, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8",
    )


def niveau_de(escalade: int) -> tuple[str, str]:
    """1 -> NOTE · 2-3 -> ATTENTION FORTE · 4+ -> ALERTE."""
    if escalade >= 4:
        return NIVEAUX[4]
    if escalade >= 2:
        return NIVEAUX[2]
    return NIVEAUX[1]


def declarer(etat: dict, scene: int, axes: list[str]) -> list[str]:
    """Marque des axes comme servis à cette scène. Remet leur escalade à zéro."""
    connus = []
    for a in axes:
        a = a.strip().lower()
        if a not in AXES:
            continue
        etat["servi"][a] = scene
        etat["escalade"].pop(a, None)
        etat["sonnerie"].pop(a, None)
        etat.setdefault("seuil", {})[a] = tirer_seuil(a)  # nouveau cycle, nouveau seuil
        etat.setdefault("gel", {}).pop(a, None)  # servi donc possible : plus de gel
        connus.append(a)
    if scene > etat.get("scene", 0):
        etat["scene"] = scene
    return connus


def amorcer(etat: dict, scene: int) -> None:
    """Première scène vue : tout est réputé servi, aucune alerte au démarrage."""
    for a in AXES:
        etat["servi"].setdefault(a, scene)
        etat.setdefault("seuil", {}).setdefault(a, tirer_seuil(a))


def evaluer(etat: dict, scene: int) -> tuple[int, str] | None:
    """Retourne (exit_code, message) s'il faut sonner, sinon None.

    Un seul message pour tous les axes en retard, le plus grave en tête.
    L'exit code vaut 2 dans tous les cas — un signalement que le MJ ne voit
    pas ne sert à rien —, mais le TON et l'exigence montent avec l'escalade.
    """
    if scene <= 0:
        return None
    if not etat["servi"]:
        amorcer(etat, scene)
        etat["scene"] = scene
        return None

    etat["scene"] = max(scene, etat.get("scene", 0))
    lignes: list[tuple[int, int, str]] = []

    gel = etat.setdefault("gel", {})

    for axe, (base, libelle, quoi) in AXES.items():
        dernier = etat["servi"].get(axe, 0)
        retard = scene - dernier
        gele_depuis = gel.get(axe)

        if gele_depuis is not None:
            duree = scene - gele_depuis
            if duree <= SEUIL_GEL:
                continue  # le lieu l'interdit vraiment : on n'embête pas le MJ
            derniere_sonnerie = etat["sonnerie"].get(axe, 0)
            if derniere_sonnerie and scene - derniere_sonnerie < PAS_SONNERIE:
                continue
            esc = etat["escalade"].get(axe, 0) + 1
            etat["escalade"][axe] = esc
            etat["sonnerie"][axe] = scene
            titre, consigne = niveau_de(esc)
            lignes.append((
                esc, duree,
                f"[{titre}] {libelle} — GELÉ depuis {duree} scènes "
                f"(tolérance {SEUIL_GEL}, sonnerie n°{esc}).\n"
                f"    → un lieu qui interdit ça aussi longtemps n'est plus une "
                f"circonstance, c'est une composition : ramène le jeu là où "
                f"c'est possible, ou dégèle.\n    → {consigne}",
            ))
            continue

        if retard <= seuil_courant(etat, axe):
            continue
        derniere_sonnerie = etat["sonnerie"].get(axe, 0)
        if derniere_sonnerie and scene - derniere_sonnerie < PAS_SONNERIE:
            continue

        esc = etat["escalade"].get(axe, 0) + 1
        etat["escalade"][axe] = esc
        etat["sonnerie"][axe] = scene
        titre, consigne = niveau_de(esc)
        # Le seuil effectif ne s'affiche jamais : le connaître, c'est
        # retrouver le métronome que le jitter vient de supprimer.
        lignes.append((
            esc, retard,
            f"[{titre}] {libelle} — {retard} scènes sans "
            f"(cadence ~{base}, sonnerie n°{esc}).\n    → {quoi}.\n    → {consigne}",
        ))

    if not lignes:
        return None

    lignes.sort(key=lambda x: (-x[0], -x[1]))
    pire = lignes[0][0]
    entete = (
        "AXES NON SERVIS — le compteur, pas la mémoire.\n"
        if pire < 4
        else "AXES NON SERVIS — ⛔ SEUIL D'ALERTE ATTEINT.\n"
    )
    corps = "\n".join(l[2] for l in lignes)
    pied = (
        "\nDéclarer ce qui est servi : "
        "`python .claude/hooks/servi.py <scene> <axe> [axe...]`\n"
        "Ne rien déclarer fait monter les compteurs — c'est voulu."
    )
    return 2, entete + corps + pied
