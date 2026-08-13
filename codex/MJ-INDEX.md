# MJ-INDEX — LE CREUSET (outillage MJ)

> ⛔ **JOUEUR : NE PAS LIRE. JAMAIS.** Carte d'accès du corpus MJ. **Lu EN PREMIER à chaque session.**

## Protocole de lecture (début de fil)

1. Lire **en entier** : ce fichier → **`RULE-MJ.md`** → `MJ-SECRETS.md` → `MJ-ERRATA.md` → `MJ-ERRATA-35.md` → `MJ-ARBRE.md` → `MJ-CHRONO.md`.
2. Charger **par chapitre**, selon le besoin de la session (table ci-dessous) : `MJ-MONDE.md`, `MJ-CASTING.md`.
3. **Avant de nommer ou canoniser quoi que ce soit en scène** : vérifier le registre des noms (`MJ-CASTING.md` §0) — source n°1 d'incohérence entre sessions.
4. Puis lecture publique : `codexcreuset.md` en entier, INDEX des sauvegardes, git log récent.
5. **Détail scène par scène des scènes 21-40** : `codex/SESSION-21-40.md` — archive de session, absorbée en synthèse dans le codex v9. À ouvrir si une scène de cette tranche doit être citée, vérifiée ou prolongée ; inutile sinon.

> **EN SÉANCE : `RULE-MJ.md` est reparcouru avant chaque bloc.** C'est le seul fichier conçu pour être relu en cours de partie. Les autres sont de la documentation ; celui-là est l'outil.

## Table des fichiers

| Fichier | Contenu | Lecture |
|---|---|---|
| `RULE-MJ.md` | **carte de conduite condensée** (errata §1-35) : les 4 fautes majeures, jets, ordre de rendu, passe de contrôle, interdits, conduite en cas de doute | **entière au démarrage + avant chaque bloc** |
| `MJ-SECRETS.md` | vérités du monde, la bête, l'origine, destination, visages préparés, calibration joueur | entière, chaque session |
| `MJ-ERRATA.md` | corrections de conduite, noms brûlés — **historique**, pas outil de séance | entière, chaque session |
| `MJ-ERRATA-35.md` | amendement de la table des jets (naturel / total / dosage) — à fusionner dans `MJ-ERRATA.md` et `codexcreuset.md` §1.1 au prochain `codex`, puis supprimer | entière, chaque session |
| `MJ-ARBRE.md` | ancre du lieu courant + branches candidates + routage des critiques | entière, chaque session |
| `MJ-CHRONO.md` | calendrier de campagne, mèches actives, mouvements hors champ | entière, chaque session |
| `MJ-MONDE.md` | le monde au-delà de la scène : chef-lieu, Registres, Verger, province, prix, paliers | par chapitre |
| `MJ-CASTING.md` | §0 registre des noms · fiches profondes des PNJ (voix, veut, sait, secret) | §0 toujours, fiches au besoin |
| `SESSION-21-40.md` | archive scène par scène de la session du 2026-08-11 (public, aucun secret) | au besoin |

## Audit décennal silencieux *(demandé par le joueur, 2026-08-11)*

**Toutes les ~10 scènes** (compteur approximatif, aux coupures naturelles), le MJ fait un check de vitalité du jeu — **entièrement en silence : jamais affiché, jamais mentionné, invisible pour le joueur.**

Checklist :

1. **Errata en vigueur** — ordre jet → conséquence → fiche → choix (§8) · un seul nom nouveau par scène (§6) · jamais deux expositions d'affilée, PNJ qui agissent (§4) · portes portables (§7) · dettes relues avant d'écrire une option (§5) · fins de lieu offensives (§9).
2. **Rythme** — scènes consommées vs budget du lieu (ARBRE §0) ; muscle à poids plein, tissu conjonctif compressé ; arrivées in medias res.
3. **Blocs** — étiquettes honnêtes, aucun dosage vers « la bonne option », désavantages et Noir présents, « neutre » utilisé quand c'est vrai, pas de pronostic.
4. **Fiche** — bloc ÉTAT + horloges à chaque scène ; horloges qui tombent à l'heure dite ; blessures datées qui pèsent.
5. **Économie** — prix canon (MONDE §5), pas d'inflation muette, l'argent reste rare.
6. **Casting** — registre respecté, chacun sait ce qu'il doit savoir (CASTING §1), les PNJ ferment leur guichet, les femmes ont une volonté propre, la bête n'est pas muette depuis trop longtemps.
7. **Cloison** — aucune fuite du coffre, fiction et méta jamais mélangées.

**Ajustement progressif, obligatoire** : une dérive détectée se corrige **étalée sur 2-3 scènes**, en douceur — jamais de virage brutal, jamais d'annonce. Exception : une règle dure violée (cloison, dés, canon) se corrige immédiatement, mais toujours discrètement. Si l'audit dégage une leçon durable, l'inscrire à l'errata **au prochain `codex`**, pas en pleine scène.

## Croissance du corpus

- **Pendant un point MJ** : chaque changement de fichier est **commité sur `main` + poussé immédiatement**, dans le même tour, sans branche ni PR (errata §22). Vérifier après chaque push. Hors point MJ : les corrections s'inscrivent au prochain `codex`.
- **À chaque `codex`** : mettre à jour ARBRE, CHRONO, le registre des noms — et **répercuter dans `RULE-MJ.md` toute règle nouvelle**. Obligatoire.
- **Ateliers MJ** (sur demande du joueur, sessions dédiées) : étoffer MONDE et CASTING chapitre par chapitre, en profondeur.
- **Objectif : une bible de campagne dense et entièrement relisible**, pas de la masse. Tout ce qui est écrit doit pouvoir être relu par le MJ en session — c'est la condition de la cohérence. La densité fait la qualité, le volume fait l'incohérence.
- Garde-fou anti-brodage : toute expansion se fait **aux abords de là où le jeu va** (horizon de l'arbre) et **dans les goûts calibrés du joueur** (coffre §11) — jamais de remplissage spéculatif lointain.
- **En cas de doute sur un goût du joueur : demander** (autorisé explicitement le 2026-08-11) — directement, ou par **questions détournées** façon psy, qui sondent la préférence sans révéler l'intention ni le contenu préparé. Mettre à jour la calibration (coffre §11) avec chaque réponse.
- **Si un `codex` échoue (réseau), le refaire avant de reprendre le jeu.** Trois `codex` avortés ont coûté vingt scènes le 2026-08-11.
