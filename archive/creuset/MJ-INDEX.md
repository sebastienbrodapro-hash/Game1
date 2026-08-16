# MJ-INDEX — LE CREUSET (outillage MJ)

> ⛔ **CAMPAGNE CLOSE — ce corpus décrit Le Creuset, terminé scène 299. Le jeu courant est décrit par `FONDATION.md` et `monde/`.**
>
> **Ne pas suivre le protocole de lecture ci-dessous pour jouer** : il charge un monde mort. L'ordre de lecture de la campagne courante est dans `CLAUDE.md`. Ce fichier est conservé comme **archive** : il documente comment le corpus du Creuset s'accédait, et il reste utile pour lire cette archive — jamais pour mener une partie.
>
> Ce qui a survécu à la clôture, ce sont les **règles de conduite** — `RULE-MJ.md`, `SEUILS.md`, `MJ-ERRATA.md` —, restées dans `codex/` et toujours en vigueur : c'est le monde qui a changé, pas la conduite.

> ⛔ **JOUEUR : NE PAS LIRE. JAMAIS.** Carte d'accès du corpus MJ (archive). **Lu EN PREMIER à chaque session** — protocole de l'époque.

## ⚠️ LES DEUX FICHIERS DE SÉANCE — TOUT LE RESTE EST DE LA DOCUMENTATION

| Fichier | Taille | Quand |
|---|---|---|
| **`SEUILS.md`** | ~3 Ko | **AVANT CHAQUE RÉPONSE.** Que des nombres. Assez court pour que ce soit vrai. |
| **`RULE-MJ.md`** | ~18 Ko | **Au démarrage, puis avant chaque bloc.** |

**Pourquoi `SEUILS.md` existe** *(2026-08-15)* : le codex lu au début d'un fil n'est plus dans la fenêtre trente scènes plus tard, et le MJ se met à écrire de mémoire dégradée. Ce jour-là il a écrit « 16 couches sur 16, passage de grade mûr et pas encore fait » alors que sa propre fiche imprimait « grade suivant à 16 » une ligne au-dessus. **Le joueur a dû passer par du méta pour une règle que le MJ imprimait lui-même.** C'est la faute la plus coûteuse du corpus : elle casse la fiction, pas seulement une scène.

## Protocole de lecture (début de fil)

1. Lire **en entier** : ce fichier → **`SEUILS.md`** → **`RULE-MJ.md`** → **`MJ-SECRETS-VUE.md`** → `MJ-ARBRE.md` → `MJ-CHRONO.md` → **`MJ-CASTING.md` §0**.

> **`MJ-ERRATA.md` ne se lit plus en séance** *(2026-08-15, validé par le joueur)* : c'est **l'historique de référence** (§1-55, consolidé par familles). Il se charge **sur événement** — contestation (« on vérifie dans le fichier »), point MJ, rédaction ou vérification d'une règle. `RULE-MJ.md` en est le condensé complet.

> ⚠️ **La VUE, jamais `MJ-SECRETS.md`.** Le coffre source contient les noms propres non encore livrés ; la vue porte la même matière avec ces noms remplacés par `⟦SCELLE-N⟧`. Le MJ garde donc tout ce qu'il lui faut pour préfigurer, et **n'a pas les étiquettes qu'il pourrait faire fuiter**. Ouvrir la source annule le dispositif — ne le faire pour aucune raison.
>
> **Le jour où la fiction livre un nom** : `python .claude/hooks/livrer-nom.py N`. En session connecteur seul (pas de shell), lire la ligne `N` de `NOMS-SCELLES.txt` — **cette ligne-là, pas le fichier**. Puis inscrire au registre `MJ-CASTING` §0.0 et à l'errata.
2. Charger **par chapitre**, selon le besoin de la session (table ci-dessous) : `MJ-MONDE.md`, `MJ-CASTING.md`.
3. **Avant de nommer ou canoniser quoi que ce soit en scène** : vérifier le registre des noms (`MJ-CASTING.md` §0) — source n°1 d'incohérence entre sessions.
4. Puis lecture publique : `codexcreuset.md` en entier, INDEX des sauvegardes, git log récent.
5. **Détail scène par scène des scènes 21-40** : `codex/SESSION-21-40.md` — archive de session, absorbée en synthèse dans le codex v9. À ouvrir si une scène de cette tranche doit être citée, vérifiée ou prolongée ; inutile sinon.

> **EN SÉANCE** : `SEUILS.md` **avant chaque réponse**, `RULE-MJ.md` **avant chaque bloc**. Ce sont les seuls fichiers conçus pour être relus en cours de partie. **Le codex ne se relit pas en séance** — c'est précisément pour ça que ces deux-là existent.
>
> **Si `RULE-MJ.md` devient trop gros pour être relu pour de vrai, le problème est le fichier, pas la relecture** : condenser, ou déplacer les invariants chiffrés vers `SEUILS.md`.

## `!` — LE CARACTÈRE DU JOUEUR *(2026-08-15)*

Envoyé seul : **arrêter, vérifier dans le fichier, corriger en une ligne, rendre la main.**
Pas de discussion de design, pas de refonte de règle, pas trois tours de méta. **Une vérification, une correction, on repart.** Le méta imposé au joueur pour une faute du MJ est lui-même le dommage.

## Le skill `creuset` — miroir généré *(2026-08-15, validé par le joueur)*

**Le dépôt est la source, le skill est un miroir.** `python .claude/hooks/generer-skill.py` fabrique le skill depuis `RULE-MJ.md` + `SEUILS.md` (copies **verbatim** — `SEUILS` octet pour octet) + `SKILL-FRONT.md` (frontmatter et protocole du skill), et l'estampille **`codex-NNN · scène N · date`**.

- **À chaque `codex`** : régénérer, présenter le zip au joueur pour installation.
- **Session ouverte par le skill** : comparer son estampille au dernier codex du dépôt — **si elle diffère, relire `RULE-MJ.md` et `SEUILS.md` depuis GitHub**.
- **En cas de divergence, GitHub gagne** — le dépôt se pousse dans le tour, le skill attend un clic.

## Table des fichiers

| Fichier | Contenu | Lecture |
|---|---|---|
| **`SEUILS.md`** | **les invariants chiffrés seuls** : bandes, jetons, modificateurs, grades de Corps, crans de la bête, paliers, **format `n/max` obligatoire** | **avant chaque réponse** |
| `RULE-MJ.md` | **carte de conduite condensée** (errata §1-49) : les 4 fautes majeures, DA, jets, ordre de rendu, passe de contrôle, interdits, conduite en cas de doute | **entière au démarrage + avant chaque bloc** |
| **`MJ-SECRETS-VUE.md`** | **le coffre tel qu'il se lit en séance** : matière intégrale, noms scellés remplacés par `⟦SCELLE-N⟧` | **entière, chaque session** |
| `MJ-SECRETS.md` | la source du coffre, avec les noms en clair. **Généré vers la VUE — ne se lit jamais en séance.** N'écrire que là, puis relancer `generer-vue.py` | jamais |
| `NOMS-SCELLES.txt` | correspondance `⟦SCELLE-N⟧` → nom. ⛔ **ne se lit pas** — une ligne, le jour d'une livraison | jamais |
| `MJ-ERRATA.md` | **l'historique de référence** (§1-55, par familles) : fautes, décisions, citations du joueur | **sur événement** — jamais en séance |
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
3. **Blocs** — étiquettes honnêtes, aucun dosage vers « la bonne option », désavantages et Noir présents, « neutre » utilisé quand c'est vrai, pas de pronostic. **Et : aucun mouvement resservi d'un bloc à l'autre** ; une option non prise deux fois est morte.
4. **Fiche** — bloc ÉTAT + horloges à chaque scène ; **toute progression en `n/max`, jamais en prose** ; horloges qui tombent à l'heure dite ; blessures datées qui pèsent.
5. **Économie** — prix canon (MONDE §5), pas d'inflation muette, l'argent reste rare.
6. **Casting** — registre respecté, chacun sait ce qu'il doit savoir (CASTING §1), les PNJ ferment leur guichet, les femmes ont une volonté propre, la bête n'est pas muette depuis trop longtemps.
7. **Cloison** — aucune fuite du coffre, fiction et méta jamais mélangées.
8. **Seuils** — relire `SEUILS.md` et confronter la fiche : un seuil écrit est un seuil dû, il tombe dans la scène même.

**Ajustement progressif, obligatoire** : une dérive détectée se corrige **étalée sur 2-3 scènes**, en douceur — jamais de virage brutal, jamais d'annonce. Exception : une règle dure violée (cloison, dés, canon) se corrige immédiatement, mais toujours discrètement. Si l'audit dégage une leçon durable, l'inscrire à l'errata **au prochain `codex`**, pas en pleine scène.

## Croissance du corpus

- **Pendant un point MJ** : chaque changement de fichier est **commité sur `main` + poussé immédiatement**, dans le même tour, sans branche ni PR (errata §22). Vérifier après chaque push. Hors point MJ : les corrections s'inscrivent au prochain `codex`.
- **À chaque `codex`** : mettre à jour **ARBRE, CHRONO, le registre des noms, les états joués de MONDE**, écrire les entrées d'errata nouvelles — **répercuter dans `RULE-MJ.md` toute règle nouvelle, dans `SEUILS.md` tout nombre nouveau** — et **refabriquer le skill** (`generer-skill.py`), le présenter au joueur. Obligatoire.
- **Ateliers MJ** (sur demande du joueur, sessions dédiées) : étoffer MONDE et CASTING chapitre par chapitre, en profondeur.
- **Objectif : une bible de campagne dense et entièrement relisible**, pas de la masse. Tout ce qui est écrit doit pouvoir être relu par le MJ en session — c'est la condition de la cohérence. La densité fait la qualité, le volume fait l'incohérence.
- Garde-fou anti-brodage : toute expansion se fait **aux abords de là où le jeu va** (horizon de l'arbre) et **dans les goûts calibrés du joueur** (coffre §11) — jamais de remplissage spéculatif lointain.
- **En cas de doute sur un goût du joueur : demander** (autorisé explicitement le 2026-08-11) — directement, ou par **questions détournées** façon psy, qui sondent la préférence sans révéler l'intention ni le contenu préparé. Mettre à jour la calibration (coffre §11) avec chaque réponse.
- **Si un `codex` échoue (réseau), le refaire avant de reprendre le jeu.** Trois `codex` avortés ont coûté vingt scènes le 2026-08-11.
