# refs — les références visuelles du canon

Ce dossier fixe **à quoi ressemblent les choses**. Une image vaut mieux qu'une
description : sans référence, chaque génération est un tirage indépendant et le
modèle réinterprète le style à chaque fois — même prompt, autre visage, autre
grain.

## `lapine-forme-finale.png`

**La forme finale de la compagne**, validée par le joueur le 2026-08-15 après
une trentaine d'essais. C'est le point d'arrivée de sa trajectoire, pas son
état de départ : au rite elle sort en animal minuscule, et elle s'humanise
palier par palier jusqu'à ça.

**Usage** : passer ce fichier en référence à chaque image d'elle —

```
python C:\Users\sebas\.claude\replicate-image.py -f prompt.txt -o scene.png \
  -i refs/lapine-forme-finale.png
```

Le prompt ne décrit alors que **ce qui change** (la pose, le lieu, l'action) et
demande explicitement de ne rien toucher d'autre.

## `lapine-tenue-figee.txt`

Le bloc de tenue, au détail près — panneaux, coutures, **exactement deux
sangles par jambe**, boucles, longueurs. À recopier tel quel : l'image seule ne
verrouille pas ces détails, ils dérivent d'un tirage à l'autre.

Le fichier contient aussi la manière de demander le **velours** : décrire le
comportement de la lumière sur le poil, jamais l'adjectif « velours ».
