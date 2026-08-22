#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Hook Stop — CAMPAGNE COURANTE. Quatre métiers, à chaque fin de tour du MJ.

1. GARDE-FOU  : cherche un nom scellé dans la sortie joueur. Si touche,
                sort en code 2 — le MJ est repris avant de rendre la main.
2. DÉPÔT      : écrit le dernier tour dans .claude/derniere-scene.md, brut.
                C'est la source du psy : il ne voit pas la conversation, et
                le MJ ne choisit pas ce qu'il lui donne à auditer.
3. CADENCE PSY: compte les scènes jouées et reprend le MJ quand le psy est
                dû. Raison d'être : une cadence que le MJ tient lui-même
                n'est pas une cadence — le MJ qui dérive est exactement
                celui qui n'appelle pas son audit. Ici il ne compte plus.
                *(Validé par le joueur le 2026-08-14, option C'.)*
4. AXES        : compte ce qui N'EST PAS servi — équipement, chances,
                économie, Corps, arts, la bête, la grosse pièce… Escalade
                note -> attention forte x2 -> alerte. Voir axes.py.
                *(Tranché par le joueur le 2026-08-15, après qu'un cinquième
                de campagne eut été bâti sur des axes jamais servis.)*

Le garde-fou est un filet, pas la ligne de défense : quand il sonne, le
message est déjà affiché. Il garantit qu'on le sait dans la seconde.

Entrée : JSON sur stdin (transcript_path, stop_hook_active).
"""
import json
import re
import sys
from pathlib import Path

sys.stderr.reconfigure(encoding="utf-8", errors="replace")
sys.path.insert(0, str(Path(__file__).resolve().parent))
try:
    import axes as AXES
except ImportError:  # le compteur ne doit jamais empêcher de jouer
    AXES = None
try:
    import file as FILE
except ImportError:  # la file ne doit jamais empêcher de jouer
    FILE = None

RACINE = Path(__file__).resolve().parents[2]
# Le coffre courant est le TRONC (monde/). L'ancien coffre du Creuset est
# archivé et n'est plus surveillé : la campagne est close.
NOMS = RACINE / "monde" / "NOMS-SCELLES.txt"
LEXIQUE = Path(__file__).resolve().parent / "lexique-interdit.txt"
DEPOT = RACINE / ".claude" / "derniere-scene.md"
ETAT = RACINE / ".claude" / "psy-etat.txt"

SEUIL_PSY = 8
# 2026-08-18 — dérive : les titres MÉTA numérotés (« ## 1 · L'échelle de
# Corps ») comptaient comme des scènes, et une scène ne recule jamais. Un
# titre de SCÈNE est en capitales (« ## 112 · CENT VISAGES ») : on exige
# qu'aucune minuscule ne suive le point médian.
TITRE_SCENE = re.compile(r"^##\s*(\d{1,4})\s*·(?!.*[a-zà-öø-ÿ])", re.MULTILINE)


# 2026-08-22 — LA FILE (file.py). Un bloc d'options qui part alors que le
# joueur a une file en cours lui refacture un choix déjà payé. Le MJ avait
# la file écrite sous les yeux et l'a écrasée quand même : le gabarit « une
# scène finit par un bloc » bat l'état. Donc c'est le hook qui tranche.
# Un bloc = au moins deux lignes numérotées en gras, plus une étiquette de jet.
LIGNE_OPTION = re.compile(r"^\s{0,3}\d{1,2}\.\s+\*\*", re.MULTILINE)
ETIQUETTE = re.compile(r"\[(?:Libre|Chiffré)", re.IGNORECASE)


def contient_bloc(texte: str) -> bool:
    return len(LIGNE_OPTION.findall(texte)) >= 2 and bool(ETIQUETTE.search(texte))


def charger_noms() -> list[str]:
    """Noms encore scellés ET assez rares pour ne pas faire sonner à tort.

    Format : id <TAB> nom <TAB> statut <TAB> alerte — voir generer-vue-tronc.py.
    Les entrées alerte=non sont expurgées de la vue du coffre mais pas
    surveillées ici : elles apparaissent en jeu, elles feraient du bruit.
    """
    if not NOMS.exists():
        return []
    noms = []
    for l in NOMS.read_text(encoding="utf-8").splitlines():
        if not l.strip() or l.startswith("#"):
            continue
        parts = l.split("\t")
        if len(parts) >= 4 and parts[2] == "scelle" and parts[3] == "oui":
            noms.append(parts[1])
    return noms


def charger_lexique() -> list[str]:
    """Mots non courants interdits en sortie joueur (RULE-MJ 0.4).

    2026-08-19 -- demande joueur : « bief, ber... devoir chercher une
    signification a chaque ligne, ca me tue. » La regle seule ne suffit pas :
    une regle qu'on peut oublier doit etre portee par un outil. La liste
    grandit sur signalement -- un mot le gene, il entre ici pour toujours.
    """
    if not LEXIQUE.exists():
        return []
    return [
        l.strip().lower()
        for l in LEXIQUE.read_text(encoding="utf-8").splitlines()
        if l.strip() and not l.startswith("#")
    ]


def dernier_tour(transcript: Path) -> str:
    """Texte du dernier tour du MJ — hors sous-agents, hors appels d'outil."""
    try:
        rows = [
            json.loads(l)
            for l in transcript.read_text(encoding="utf-8").splitlines()
            if l.strip()
        ]
    except (OSError, json.JSONDecodeError):
        return ""

    morceaux: list[str] = []
    for r in reversed(rows):
        if r.get("isSidechain"):
            continue  # sortie d'un sous-agent : jamais vue par le joueur
        t = r.get("type")
        contenu = r.get("message", {}).get("content")

        if t == "user":
            # Les résultats d'outil reviennent aussi en type "user" : ce n'est
            # pas le joueur, on continue de remonter. Seul un vrai message
            # ferme le tour.
            if isinstance(contenu, str):
                break
            if isinstance(contenu, list) and any(
                b.get("type") != "tool_result" for b in contenu
            ):
                break
            continue

        if t != "assistant" or not isinstance(contenu, list):
            continue
        for b in reversed(contenu):
            if b.get("type") == "text" and b.get("text", "").strip():
                morceaux.append(b["text"])
    return "\n\n".join(reversed(morceaux)).strip()


def lire_etat() -> tuple[int, int]:
    """(numéro de la dernière scène vue, numéro du dernier passage du psy)."""
    derniere = dernier_psy = 0
    if ETAT.exists():
        for l in ETAT.read_text(encoding="utf-8").splitlines():
            cle, _, val = l.partition("=")
            val = val.strip()
            if not val.isdigit():
                continue
            if cle.strip() == "derniere_scene":
                derniere = int(val)
            elif cle.strip() == "dernier_psy":
                dernier_psy = int(val)
    return derniere, dernier_psy


def ecrire_etat(derniere: int, dernier_psy: int) -> None:
    ETAT.write_text(
        f"derniere_scene={derniere}\ndernier_psy={dernier_psy}\n", encoding="utf-8"
    )


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0  # pas de payload exploitable : ne jamais bloquer le jeu

    # Déjà repris une fois sur ce tour : ne pas boucler.
    deja = bool(payload.get("stop_hook_active"))

    transcript = Path(payload.get("transcript_path", ""))
    texte = dernier_tour(transcript) if transcript.exists() else ""

    if texte:
        DEPOT.parent.mkdir(parents=True, exist_ok=True)
        DEPOT.write_text(texte, encoding="utf-8")

    if deja or not texte:
        return 0

    # Cadence : on suit le numéro de scène, pas un compteur de tours — un
    # point MJ ne fait pas avancer le jeu, et une scène ne recule jamais.
    derniere, dernier_psy = lire_etat()
    vus = [int(n) for n in TITRE_SCENE.findall(texte)]
    if vus and max(vus) > derniere:
        derniere = max(vus)
    if dernier_psy == 0:  # première initialisation : pas d'alerte au démarrage
        dernier_psy = derniere

    # 2026-08-14 — faux positif : IGNORECASE faisait sonner le hook sur un mot
    # français courant qui coïncide avec un nom scellé court. Un nom lâché en
    # scène porte toujours sa capitale ; la prose ordinaire, non. On teste donc
    # les seules casses d'un nom propre, et plus jamais les minuscules.
    touches = [
        n for n in charger_noms()
        if len(n) >= 4 and any(
            re.search(rf"\b{re.escape(v)}\b", texte)
            for v in {n, n.capitalize(), n.upper()}
        )
    ]
    if touches:
        ecrire_etat(derniere, dernier_psy)
        print(
            "GARDE-FOU COFFRE — un nom scellé est apparu dans la sortie joueur : "
            + ", ".join(touches)
            + ".\nErrata §1 : un nom fuité est brûlé. Le message est déjà affiché.\n"
            "Traiter maintenant, avant toute suite : dire au joueur ce qui vient "
            "de se produire, et ouvrir l'errata.\n"
            "Si c'est un faux positif (mot commun capté par l'extraction), le dire "
            "en une ligne et continuer.",
            file=sys.stderr,
        )
        return 2

    # LEXIQUE (RULE-MJ 0.4) : un mot non courant dans la sortie joueur.
    # Mot entier, toute casse ; les noms propres du monde ne sont pas listés.
    mots = [
        m for m in charger_lexique()
        if re.search(rf"\b{re.escape(m)}\b", texte, re.IGNORECASE)
    ]
    if mots:
        ecrire_etat(derniere, dernier_psy)
        print(
            "LEXIQUE — mot(s) non courant(s) dans la sortie joueur : "
            + ", ".join(sorted(set(mots)))
            + ".\nRULE-MJ §0.4 : la prose se tient en français courant.\n"
            "Donner au joueur l'équivalent simple EN UNE LIGNE, et ne plus "
            "jamais employer ce mot. Si le mot est devenu un nom propre du "
            "monde, le retirer de .claude/hooks/lexique-interdit.txt.",
            file=sys.stderr,
        )
        return 2

    # LA FILE — le test qui ne repose plus sur la vigilance du MJ.
    # Il ne sonne que si une scène a AVANCÉ dans ce tour : les continuations
    # (combat en échanges, boutique) gardent leurs blocs légitimes, et le
    # `--suite` couvre le cas où l'option en tête se joue en plusieurs
    # messages. Un hook qui sonne à tort est un hook qu'on éteint.
    scene_neuve = bool(vus) and max(vus) >= derniere and max(vus) not in (0,)
    if FILE is not None and scene_neuve:
        try:
            etat_file = FILE.charger()
        except Exception:  # noqa: BLE001 — jamais bloquer le jeu sur l'outil
            etat_file = None
        if etat_file and etat_file["file"] and not etat_file["suite"]:
            if contient_bloc(texte):
                ecrire_etat(derniere, dernier_psy)
                reste = ", ".join(str(x) for x in etat_file["file"])
                print(
                    "FILE DU JOUEUR — un bloc d'options est parti alors que sa "
                    f"file n'est pas vide (reste : {reste}).\n"
                    "OPUS §1ter : file non vide = AUCUN bloc. La scène suivante "
                    "est déjà décidée, elle s'ouvre sans rien lui demander.\n"
                    "Deux cas, un seul est vrai — trancher MAINTENANT :\n"
                    "  1. l'option en cours est FINIE : `python .claude/hooks/"
                    "file.py --consomme`, puis retirer le bloc et enchaîner la "
                    "suivante ;\n"
                    "  2. l'option en cours se joue en plusieurs messages "
                    "(échanges de combat, boutique) et ce bloc lui appartient : "
                    "`python .claude/hooks/file.py --suite`, et continuer.\n"
                    "Dans les deux cas, le dire au joueur en une ligne.",
                    file=sys.stderr,
                )
                return 2

    # Les axes passent APRÈS le coffre (une fuite prime sur tout) mais AVANT
    # le psy : un audit sur une tranche dont le contenu manque auditerait le
    # symptôme, pas la cause.
    if AXES is not None and derniere > 0:
        try:
            etat_axes = AXES.charger()
            verdict = AXES.evaluer(etat_axes, derniere)
            AXES.sauver(etat_axes)
        except Exception:  # noqa: BLE001 — jamais bloquer le jeu sur le compteur
            verdict = None
        if verdict:
            ecrire_etat(derniere, dernier_psy)
            print(verdict[1], file=sys.stderr)
            return verdict[0]

    if derniere - dernier_psy >= SEUIL_PSY:
        # L'alerte est consommée tout de suite : un hook qui redemande à
        # chaque tour est un hook qu'on éteint.
        ecrire_etat(derniere, derniere)
        print(
            f"CADENCE PSY — {derniere - dernier_psy} scènes depuis le dernier "
            f"passage (sc. {dernier_psy} -> sc. {derniere}).\n"
            "Lancer le sous-agent `psy` maintenant, en arrière-plan, avant de "
            "rendre la main.\n"
            "Sa sortie se relaie MOT POUR MOT dans un message méta séparé de la "
            "fiction (codex §1.8) — la reformuler, c'est éditer son propre audit. "
            "SILENCE ne s'affiche pas.",
            file=sys.stderr,
        )
        return 2

    ecrire_etat(derniere, dernier_psy)
    return 0


if __name__ == "__main__":
    sys.exit(main())
