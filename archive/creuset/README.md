# ⛔ ARCHIVE — NE JAMAIS CHARGER CE CORPUS POUR JOUER

**Le jeu courant est décrit par `FONDATION.md` et `monde/`.** L'ordre de lecture d'une session vit dans `CLAUDE.md`, à la racine. Rien de ce dossier n'y figure.

Ce qu'il y a ici est l'**état** d'une campagne terminée : un monde, des personnages, un calendrier, un point de reprise. Le charger ne rendrait pas le MJ plus cohérent — ça le rendrait cohérent avec un monde qui n'existe plus. C'est précisément la faute que ce déplacement supprime : un fichier simplement marqué « close » reste chargeable par accident, un fichier déplacé ne l'est plus.

---

## Ce que fut cette campagne

**« Le Creuset »** — héros **Seb**, quinze ans, jeu de rôle solo mené par Claude en Maître du Jeu. Ouverte le 2026-08-10, **close à la scène 299 le 2026-08-16**, sur décision du joueur : *« je veux pas continuer un jeu qui a 1/5ᵉ est basé sur plein de trucs foireux. »* Cinq axes du palier II n'avaient jamais été servis en 111 scènes — équipement, économie, chances, réclusions, examens.

C'est de ce constat qu'est né le **compteur d'axes** (`.claude/hooks/axes.py`), qui compte ce qui **n'est pas** servi. La campagne close a donc payé l'outil que la suivante utilise.

Avant elle, **« Le Parieur »** (Ji Wen) — `codexjiwen.md`, close également.

## Ce qu'il y a dans ce dossier

| Fichier | Quoi |
|---|---|
| `codexcreuset.md` | l'état canonique final (v25) : fiche, portes, casting, point de reprise |
| `MJ-INDEX.md` | la carte d'accès du corpus — **son protocole de lecture ne se suit plus** |
| `MJ-MONDE.md` · `MJ-CASTING.md` | le monde au-delà de la scène, et les fiches profondes des PNJ |
| `MJ-ARBRE.md` · `MJ-CHRONO.md` | le routage des lieux et des critiques ; le calendrier de campagne |
| `MJ-SECRETS.md` · `MJ-SECRETS-VUE.md` · `NOMS-SCELLES.txt` | le coffre et sa vue expurgée. **Ne s'ouvrent pas**, archive ou pas |
| `codex-001.md` … `codex-024.md` · `INDEX.md` | les sauvegardes figées et leur index |
| `SESSION-21-40.md` | l'archive scène par scène du 2026-08-11 |
| `SKILL-FRONT.md` | le frontmatter du skill `creuset`, **neutralisé** (`generer-skill.py` refuse de tourner) |
| `codexjiwen.md` | « Le Parieur », la campagne d'avant |

Les tags `codex-001` … `codex-024` restent valides : ils pointent sur des commits, pas sur des chemins.

## Ce qui n'est PAS ici, et pourquoi

**La conduite est restée dans `codex/`** — `RULE-MJ.md`, `SEUILS.md`, `MJ-ERRATA.md` — **parce qu'elle sert toujours.** C'est le monde qui a changé, pas la conduite : un seuil écrit est dû, un bloc se sert entier, une action = un jet, le naturel ouvre et le total paie, aucun plafond nulle part, fiction et méta jamais dans le même souffle. Ces règles ont été payées scène par scène ; elles survivent à leur monde.

`RULE-MJ.md` a été **purgé** le 2026-08-16 de tout ce qui décrivait le Creuset. `MJ-ERRATA.md`, lui, garde ses entrées d'époque — c'est un registre historique — mais celles qui ne valent plus pour la campagne courante y sont **marquées remplacées** (§34.1, §34.2).

## Ouvrir ce dossier quand même

Deux cas légitimes, et deux seulement :

1. **Le joueur le demande** — un regard rétrospectif sur une campagne qu'il a vécue. Le sous-agent `psy` a ce droit sur demande explicite.
2. **Vérifier une règle** dont l'errata cite un précédent d'époque.

Dans les deux cas : **le coffre reste hors périmètre**, et toute recherche dans ce dossier porte un `glob` explicite — jamais le dossier nu.
