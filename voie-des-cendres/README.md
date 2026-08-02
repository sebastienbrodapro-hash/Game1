# 🔥 La Voie des Cendres

RPG textuel de cultivation martiale (inspiré des manhua de type wuxia/xianxia, histoire 100 % originale), développé avec **Godot 4.3** pour mobile.

> Su Han, orphelin aux « veines de pierre », balaye la Cour des Lanternes de la Secte du Pin Noir. Tout le monde sait qu'il ne pourra jamais cultiver. Tout le monde a tort : sous les cuisines couve le cœur d'un Arbre céleste brûlé il y a trois siècles, et sa cendre cherche un héritier.

## Le concept

- **Acte I jouable** : de disciple-balai méprisé jusqu'à **chef de la Secte du Pin Noir** (la suite mènera, acte après acte, jusqu'à la maîtrise du cosmos et de toutes les dimensions).
- **Deux onglets** : *Histoire* (le récit se déroule, tes choix en bas) et *Personnage* (fiche complète qui évolue).
- **Fiche de personnage** : rang de cultivation (Mortel → Souffle Éveillé → Rivière Intérieure → Racine de Jade → Fondation du Vide…), 5 statistiques (Corps, Souffle, Esprit, Perception, Destin), techniques, possessions.
- **12 secrets cachés** : des choix invisibles (marqués ✦ quand ils apparaissent) qui ne se révèlent que si tes statistiques sont assez hautes — stèles oubliées, puits scellé, épée qui murmure, autel d'une autre dimension… Certains changent la fin.
- **3 fins différentes** pour devenir chef de secte : la droiture, la ruse, ou une voie secrète.
- **Sauvegarde automatique** à chaque choix.
- **Texte déjà lu grisé** : à chaque nouveau choix, tout ce qui précède s'assombrit pour qu'on ne perde jamais le fil.
- **Illustrations par scène (à fournir)** : chaque passage du récit est associé à une image. Le pack de prompts [`art/PROMPTS.md`](art/PROMPTS.md) permet de générer les 76 illustrations en style manhua avec n'importe quel générateur d'images IA — il suffit de déposer les fichiers PNG/JPG dans `art/` avec le bon nom, et le jeu (et l'APK) les intègre automatiquement.

## Structure du projet

```
voie-des-cendres/
├── project.godot            # projet Godot 4.3 (rendu mobile, portrait)
├── export_presets.cfg       # préréglage d'export Android
├── scenes/main.tscn         # scène racine
├── scripts/
│   ├── game.gd              # état du joueur : stats, rangs, drapeaux, secrets, sauvegarde
│   └── main.gd              # interface : onglets, journal du récit, boutons de choix, fiche
├── data/story.json          # tout le récit : nœuds, choix, conditions, effets, images
├── art/                     # les illustrations (PNG/JPG à déposer) + PROMPTS.md
└── tools/
    ├── validate_story.py    # vérifie l'intégrité du graphe narratif + les images
    ├── validate_art.py      # vérifie que les SVG sont compatibles avec le rendu Godot
    ├── apply_images.py      # associe les nœuds du récit aux illustrations
    └── simulate_playthrough.py  # joue une partie complète pour valider l'équilibrage
```

## Ajouter du contenu

Tout le récit vit dans `data/story.json`. Un nœud :

```json
"mon_noeud": {
  "text": "Le texte affiché (BBCode accepté).",
  "choices": [
    {
      "text": "Libellé du choix",
      "goto": "noeud_suivant",
      "require": { "perception": 10, "realm": 2, "flag": "un_drapeau" },
      "secret": true,
      "once": "drapeau_une_seule_fois",
      "effects": { "stats": { "souffle": 2 }, "tech": "Nom", "item": "Nom", "secret_id": "id", "realm": 3, "flags": ["x"] }
    }
  ]
}
```

- `require` + `secret: true` → le choix est **invisible** tant que les conditions ne sont pas remplies (c'est le mécanisme des secrets).
- `require` sans `secret` → le choix est visible mais verrouillé, avec l'indice des prérequis.
- `"image": "nom"` sur un nœud → affiche `art/nom.svg` en tête du passage.
- Après modification, lancer `python3 tools/validate_story.py`.

## APK Android 🤖

Compilé automatiquement par GitHub Actions (workflow « Build La Voie des Cendres APK ») à chaque modification du jeu : onglet **Releases** du dépôt → « La Voie des Cendres — APK Android » → `voie-des-cendres.apk`.

## Tester sur PC

Ouvrir le dossier dans Godot 4.3+, ou en ligne de commande : `godot --path voie-des-cendres`.
