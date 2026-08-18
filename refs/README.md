# refs — les références visuelles du canon

Ce dossier fixe **à quoi ressemblent les choses**. Une image vaut mieux qu'une
description : sans référence, chaque génération est un tirage indépendant et le
modèle réinterprète tout à chaque fois — même prompt, autre visage, autre grain.

---

## La compagne — les six paliers du corps

Établis le 2026-08-15, **du dernier au premier**, chacun généré depuis le
précédent et validé par le joueur avant de descendre d'un cran. C'est ce
chaînage qui fait qu'on la reconnaît du lapereau à la femme.

| | Fichier | Humanité | Âge morpho. | Ce que le palier apporte |
|---|---|---|---|---|
| **1** | `lapine-palier-1.png` | animal | — | **Le lapereau.** 30 cm, quatre pattes, tient dans une paume. |
| **2** | `lapine-palier-2.png` | ~40 % | ~10 ans | **Debout.** Torse vertical, épaules, bras — mais des pattes au bout. |
| **3** | `lapine-palier-3.png` | ~60 % | ~14 ans | **Les mains.** Cinq doigts. Elle prend, elle tient, elle rend. |
| **4** | `lapine-palier-4.png` · `-dos.png` | 75 % | **18 ans, majeure** | Silhouette humaine, visage humain aux traits de lièvre. |
| **5** | `lapine-palier-5.png` | 85 % | 22 ans | Visage entièrement humain, la fourrure recule. |
| **6** | `lapine-forme-finale.png` | 95 % | 26 ans | **La femme.** Oreilles et queue, rien d'autre. Mi-campagne. |

### Les invariants — ce qui ne bouge sur aucun palier

- **LES YEUX.** Même vert de jade pâle, même forme, même ligne de paupière, de
  face, du lapereau à la femme. C'est le seul trait qui traverse toute la
  transformation, et au palier 1 c'est **la seule chose anormale sur elle** :
  un lapin ordinaire qui soutient le regard une seconde de trop.
- **La queue** : gros pompon rond et volumineux, jamais une touffe discrète.
- Le blanc argenté, les longues oreilles, le sourire **lèvres closes — aucune
  dent visible**, jamais de croc ni de canine (c'est une lapine, pas une
  chauve-souris).
- **Pas de griffes** : ongles humains courts et ronds dès qu'elle a des mains.

### Deux règles de composition apprises en chemin

- **Le museau n'apparaît qu'au palier 2.** Aux paliers 3 et 4, profil plat :
  75 % d'humanité veut dire qu'on voit une femme aux traits de lièvre, jamais
  un lièvre aux traits humains.
- **Le vêtement porte le charme, le visage porte l'âge et l'espèce.** Pour la
  rendre plus attachante, on change la coupe de sa robe — on ne déforme pas sa
  tête. Et la richesse de la tenue suit l'histoire : haillons au 2, tissu
  honnête au 3-4, soie au 5, velours au 6.

---

## Comment s'en servir

Passer le palier voulu en référence, et **ne décrire que ce qui change** :

```
python C:\Users\sebas\.claude\replicate-image.py -f prompt.txt -o scene.png \
  -i refs/lapine-forme-finale.png
```

L'option `-i` est répétable : on peut donner **deux références** et préciser ce
qu'on prend à chacune — le personnage à l'une, la matière et la lumière à
l'autre. C'est ainsi que la fiche finale a été obtenue.

## `lapine-tenue-figee.txt`

La tenue du palier 6 au détail près — panneaux, coutures, **exactement deux
sangles par jambe**, boucles, longueurs. À recopier tel quel : l'image seule ne
verrouille pas ces détails, ils dérivent d'un tirage à l'autre.

Il contient aussi la manière de demander le **velours** : décrire le
comportement de la lumière sur le poil — ce qui l'absorbe, ce qui l'éclate,
l'absence de reflet spéculaire — et jamais l'adjectif « velours ».

---

## Le palier 7 — LE HALO *(versé le 2026-08-18, validé en séance)*

Corps de la forme finale (`lapine-forme-finale.png`), tenue de combat fermée au
dos, écusson cousu à plat entre les omoplates, et **l'auréole** — un anneau de
lumière froide, debout derrière elle, qui n'éclaire rien. En xianxia l'auréole
n'a pas la connotation occidentale : c'est un signe de rang, pas de sainteté.

| Fichier | Quoi |
|---|---|
| `lapine-palier-7.png` | **LA référence canon du palier** — l'auréole style ange, validée par le joueur |
| `lapine-palier-7-equipement.png` | l'équipement à plat : bottes, sangles, ceinture à anneau de fer, cordelette à poignée d'os, clochette |
| `lapine-ecusson-dos.png` | le dos propre : écusson brodé à plat, lièvre assis devant la porte |
| `lapine-tenue-face.png` · `lapine-tenue-dos.png` | les planches de base face/dos — **la face ne se regénère pas de zéro** : les générateurs la refusent, on dérive toujours de cette planche |
| `lapine-scene-etalon.png` | l'étalon « photogramme de film » — cadrage, grain, lumière : c'est ce rendu qu'on vise |
| `lapine-scene-cour.png` · `-porte-eau.png` · `-cape-dos.png` | les trois scènes de dos validées (cour, quai, cape de voyage au même écusson) |

**Règles de génération apprises à la dure** : le changement demandé s'écrit **en tête** de prompt, la préservation en queue — l'inverse fait copier la référence. Une modification par passe. Jamais de chaînage pour la matière (le velours meurt passe après passe) : repartir de la planche pristine. Deux références = deux rôles, dits explicitement (image 1 le personnage et la matière, image 2 le design). Outil : Kling `gemini-3-pro-image` (voir la mémoire `kling-cli-setup`).
