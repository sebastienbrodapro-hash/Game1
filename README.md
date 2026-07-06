# Chronique Incrémentale

Jeu web incrémental historique en HTML, CSS et JavaScript vanilla.

Le projet part d'un arbre de progression inspiré des tree incrementals (Antimatter Dimensions, Celestial Incremental) : époques historiques, jalons, challenges, milestones et transmission/prestige.

## Lancer depuis Git

```bash
git clone https://github.com/sebastienbrodapro-hash/Game1.git
cd Game1
```

Ouvrir ensuite `index.html` dans le navigateur.

Aucun serveur local et aucune dépendance ne sont nécessaires.

## Boucle de jeu

- Suivre le fil conducteur, de la Préhistoire au Futur.
- Accumuler des Points d'évolution, ressource principale pendant tout le jeu.
- Produire des ressources propres à chaque époque.
- Acheter des métiers et des jalons dans les deux arbres de l'époque active.
- Franchir des paliers de 10 producteurs pour obtenir des sauts de production.
- Débloquer des challenges via des jalons d'épreuve dans l'arbre.
- Compléter des challenges historiques qui redémarrent temporairement l'âge courant avec des contraintes négatives.
- Conserver les bonus d'évolution, milestones et récompenses permanentes pendant les challenges.
- Débloquer des milestones et transmettre l'héritage.
- La sauvegarde est automatique dans le navigateur.

## Interface

- Thème sombre atmosphérique ; chaque époque teinte l'interface de sa couleur.
- Arbres façon « Hex of Power » (Celestial Incremental) : nodes compacts reliés par des branches, achat au clic direct sur le node.
- Détails (description, coûts avec possédé/requis, production, prérequis, effets) dans une infobulle au survol.
- Sélecteur d'achat ×1 / ×10 / Max pour les métiers.
- Toasts d'événements : paliers atteints, jalons et métiers révélés, époque débloquée, épreuve prête.
- Rendu incrémental : l'arbre n'est reconstruit qu'aux achats, les états (abordable, en attente, verrouillé) sont mis à jour en continu.

## Contenu actuel

- Préhistoire : 10 jalons, 7 métiers en chaînes, premier layout long.
- Néolithique : 11 jalons, 7 métiers, 2 challenges (Grande sécheresse, Hiver volcanique).
- Antiquité : 11 jalons, 6 métiers, 2 challenges (Guerres puniques, Crise de la République).
- Moyen Âge → Futur lointain : squelettes à enrichir sur le même modèle.

## Pacing

La Préhistoire est calibrée comme premier layout long, avec 10 jalons révélés progressivement et 5 chaînes de progression qui convergent vers `Tribu stable`. Le Néolithique et l'Antiquité suivent la même logique : chaque jalon révèle la suite de l'arbre et ouvre de nouveaux métiers.

## Structure

```text
index.html
styles.css
game.js
assets/
```
