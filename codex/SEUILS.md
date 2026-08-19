# SEUILS — LES NOMBRES, RIEN D'AUTRE

> **Relu avant chaque réponse.** Une demi-page exprès : si ce fichier grossit, il ne sert plus à rien.
> Aucune prose, aucun secret, aucun état de partie — **que des invariants**.
> *(Le miroir dans le skill `creuset` est retiré le 2026-08-16 : le skill est celui de la campagne close, sa copie embarquée avait divergé de 33 lignes, et une déclaration de miroir fausse est pire que pas de miroir du tout.)*

---

## LE D100

| Total | Bande | Jetons |
|---|---|---|
| **01-05** | minimum vital | **+2** |
| **06-25** | réduit + complication | **+1** |
| **26-50** | obtenu, à un prix | — |
| **51-85** | plein, sans prix | — |
| **86-100** | au-delà | — |

*(Recalage tranché par le joueur le 2026-08-16. L'ancienne table faisait coûter **65 %** des jets, avant même les modificateurs — et ils tournaient tous en négatif. Pleins ou mieux : **50 %**. Échec dur : **5 %** au lieu de 10.)*

- **Naturel `01-10`** → porte négative ouverte ou +1 cran. **Naturel `90-100`** → porte positive ouverte ou +1 cran. **Rien d'autre n'ouvre une porte.**
- **Le total paie (jetons + bande). Le naturel ouvre (portes).**
- Total ≥ 90 sans naturel critique → petit plus. Total ≤ 10 sans naturel critique → conséquence plus mauvaise. **Aucun mouvement de porte dans ces deux cas.**
- **Une porte positive acquise ne se perd jamais sur un jet.**

## MODIFICATEURS

petit **±5** · moyen **±10** · gros **±15/±20** · neutre **0**

**⛔ LE MODIFICATEUR NE SE CALCULE JAMAIS SUR LA PUISSANCE DE L'ADVERSAIRE.** Le chiffre a déjà réglé la question de la force avant le jet. Étiqueter « désavantage » parce que la chose en face est grosse, c'est **du gonflement déguisé en dé** — la faute §15/§49 sous une autre forme *(§55 — détail à l'errata)*.

Le modificateur ne vient que de la **circonstance** : terrain, fatigue, blessure, aveuglement, nombre, surprise, un art inconnu, un poison, une formation — ou un axe où le chiffre ne sert à rien (**le Corps**).

**⛔ LES AVANTAGES SE SERVENT AUTANT QUE LES DÉSAVANTAGES.** *(2026-08-16 — FAUTE : **zéro avantage en vingt-six scènes**, relevée par le joueur.)* La circonstance joue **dans les deux sens**. Un avantage est **dû** quand :
- une **porte** s'applique à son domaine · un **art** sert ce pour quoi il est fait · un **équipement** adapté est employé ;
- il agit sur un **terrain qu'il connaît** ou qu'il a préparé ;
- **elle** agit avec lui — une seconde paire de mains, armée ;
- il a l'**initiative**, la **surprise**, le **nombre**, ou un **allié qui pèse**.

*Modéliser la difficulté sans jamais modéliser la préparation ne rend pas le jeu dur : ça le rend faux. Et l'étiquette annoncée est honorée dans les deux sens (§10).*

**« Neutre » est le défaut, pas l'exception.** Ne pas empiler ±5 sur des enjeux distincts.
**L'étiquette annoncée est honorée** : une option étiquetée neutre se jette à 0.
**Ligne mort** seulement quand la mort est réellement sur la table — pas comme décoration de tension.

**⛔ LA LIGNE MORT S'ARME SUR LE NATUREL** *(tranché par le joueur, 2026-08-18)* : sur une option `mort`, une **catastrophe naturelle** met la mort elle-même en scène. La survie n'existe que si la scène offre un **prix réel, payable, déjà présent** — et il se paie au maximum : le corps cassé, une porte négative, ce que la scène réclame. **S'il n'y a pas de prix payable, c'est la mort — jamais un coût inventé pour faire survivre.** Sans naturel critique, la mort reste une présence, pas un verdict. En combat, la bascule puis l'acharnement restent l'autre chemin de la mort.

## JETONS — plafond 10

**Un seul usage : `5 jetons`, déclarés AVANT le jet → deux dés, le meilleur TOTAL l'emporte, automatiquement.**

- **Le dé gardé paie ET ouvre.** Si son naturel est critique, la porte tombe ; si c'est l'autre dé qui l'avait, **elle est perdue**. Le dé écarté ne s'affiche pas.
- **Pas d'empilement** : 5 jetons = 2 dés, quel que soit le stock.
- **Gain inchangé** : `01-10` → **+2** · `11-35` → **+1**.
- Outil : `python .claude/hooks/jet.py [mod] --jetons [étiquette]`.

*(Refonte tranchée par le joueur le 2026-08-16. Remplace **définitivement** : `+20` à 1 jeton, réussite garantie à 3, triomphe garanti à 6 — l'échelle de la campagne close.)*

## LES ÉCHELLES DU MONDE — RENVOI

**Les tables-monde de l'ancienne campagne — paliers, échelle humaine du Murim, Corps en grades, bête en six crans — sont sorties de ce fichier le 2026-08-16** : elles décrivaient le Creuset, clos à la scène 299, et contredisaient le monde neuf. Ce qui décrit un monde vit dans le monde :

- **Les quatre strates et la conversion ×1000** : `FONDATION.md` §2.
- **La compagne — 9 jalons de corps et d'esprit entrelacés, puis 3 divins** : `FONDATION.md` §3.
- **L'échelle humaine, les bandes publiques, les chiffres MJ de la strate I** : `monde/CENT-VALLEES.md` §0.7 et §1.
- **Le Corps, les arts, les portes, les déclencheurs de son esprit** : `monde/SYSTEMES.md`.
- **La puissance = CORPS + QI**, les deux s'additionnent dans le chiffre ; **ni les arts ni l'équipement ne comptent** — le chiffre mesure ce qu'on **est**, jamais ce qu'on **a** (`SYSTEMES.md` §0).

## LE CORPS DANS LE CHIFFRE — UN GRADE = UNE BANDE

| Grade | Total | La couche |
|---|---|---|
| **I · LE GRÈS** | **+40** | **+10** |
| **II · LE BRONZE** | **+400** | **+100** |
| **III · LE JADE** | **+4 000** | **+1 000** |
| **IV · LA LUMIÈRE** | **+40 000** | **+10 000** |

**C'est LA COUCHE qui compte, pas le grade** — et elle monte le chiffre **dans la scène même** (§51). Unités de la strate I. *(Tranché par le joueur le 2026-08-16, sur faute.)*

**⛔ L'ÉCHELLE NE S'ARRÊTE JAMAIS.** Chaque grade vaut **×10** le précédent, indéfiniment — cycles de quatre (= ×1000 = une strate). **Tous les cycles sont nommés d'avance** *(2026-08-18)* : **II** LA FOUDRE · LA LUNE · LE SOLEIL · LE FIRMAMENT (**+400 k · +4 M · +40 M · +400 M**) · **III** L'ÉTOILE · LE FLEUVE D'ÉTOILES · LE VIDE · L'AUBE · **IV** LE MOT · LA TRAME · LA LOI · LE PEU (`SYSTEMES` §1.0). *Un plafond sur le Corps serait un plafond sur lui (§E.0).*

**Invariants de conduite maintenus** (ils ne décrivent aucun monde) :
**AUCUN PLAFOND SUR LE PORTEUR — ce qui sature, ce sont les instruments.**
**Aucun plafond à l'intérieur d'une strate.** Arriver au plafond de la strate suivante n'est pas un défaut à corriger.

## LE COMBAT — RÉGIMES ET FENÊTRES

**Le régime se lit sur la puissance ENGAGÉE** — max( chiffre · poids d'objet · portée d'art dans son domaine ), des deux côtés (`SYSTEMES` §5).

| Strate | « à hauteur » | écrasement dès |
|---|---|---|
| **I** | ×⅔ – ×1,5 | **×1,5** |
| **II** | ×½ – ×2 | **×2** |
| **III** | ×⅓ – ×3 | **×3** |
| **IV** | ×⅕ – ×5 | **×5** |

**Échanges : 1 à 5** · un jet par échange · **01-25 : son coup à lui passe** · **bascule : 2 mauvaises bandes d'affilée** → le bloc n'offre plus que des sorties · **la retraite renchérit d'échange en échange**.
**Écrasement : victoire gratuite** — jet seulement sur vraie question ; perdre/fuir n'existent pas. **Au-dessus : l'intention se scale** — survivre, marquer, retarder, voler, fuir.

## L'ESPRIT DE LA COMPAGNE — MOMENTS COMPTÉS

**A = 2 · B = 3 · C = 4** moments, notés à la fiche (`esprit B 2/3`). Familles et auto-qualifiants : `SYSTEMES` §4.0. **C au plus tard vers ~30-35.**

## RÉCLUSIONS — DURÉE RÉELLE

**Une lune = un gain de ligne** (couche, cran, raffinage × les nuits) · **une saison = deux** · un an = trois à quatre · **un seul jet, à la sortie** · **le monde bouge : 1-2 évolutions imprimées par lune.**

## FORMAT DE FICHE — OBLIGATOIRE

**Toute progression s'écrit `n/max`. Jamais en prose. ⛔ JAMAIS `n/?`.**

`CORPS — 2/4` · `bête 3/9` · `jetons 7/10` · `ART 2/5` · `porte 3/4`

**⛔ LE CHIFFRE NE SE DÉCOMPOSE JAMAIS.** La paire porte **un** chiffre — pas deux parts (`FONDATION` §3, `CENT-VALLEES` §0.5). La fiche imprime `chiffre de la paire — N`, **jamais** « lui X · elle Y » : la répartition est une invention du MJ, l'instinct ne lit qu'un **total** (`SYSTEMES` §0.1), et aucun instrument du monde ne rend autre chose. *(Tranché par le joueur le 2026-08-16, sur faute — la décomposition était imprimée depuis la première fiche.)*

**Le max se fixe au moment où la ligne naît** — à l'acquisition d'un art, à l'ouverture d'une porte —, entre **3 et 6** selon la profondeur, et il ne bouge plus.
**Un `?` n'est pas un max, c'est de la prose déguisée** : sans max, aucun seuil n'est écrit, donc rien n'est dû — et §51 est la faute la plus coûteuse du corpus. *(Tranché par le joueur le 2026-08-16, sur faute : deux portes ouvertes en `1/?`.)*

*Exemples **inventés et figés** — l'état courant vit sur la fiche de séance, jamais ici (§54 : le pourquoi est à l'errata).*

## `!` — LE CARACTÈRE DU JOUEUR

Envoyé seul : **arrête, vérifie dans le fichier, corrige en une ligne, rends la main.**
Pas de discussion de design, pas de refonte de règle, pas trois tours de méta.
