# Chronique Incrementale

Jeu web incremental historique en HTML, CSS et JavaScript vanilla.

Le projet part d'un arbre de progression inspire des tree incrementals : epoques historiques, nodes, challenges, milestones et transmission/prestige.

## Lancer depuis Git

```bash
git clone https://github.com/sebastienbrodapro-hash/Game1.git
cd Game1
```

Ouvrir ensuite `index.html` dans le navigateur.

Aucun serveur local et aucune dependance ne sont necessaires.

## Boucle de jeu

- Suivre le fil conducteur, de la Prehistoire au Futur.
- Accumuler des Points d'evolution, ressource principale pendant tout le jeu.
- Produire des ressources propres a chaque epoque.
- Acheter des producteurs et des nodes dans l'arbre central.
- Franchir des paliers de 10 producteurs pour obtenir des sauts de production.
- Debloquer des challenges via des nodes dedies.
- Completer des challenges historiques qui redemarrent temporairement l'age courant avec des contraintes negatives.
- Conserver les bonus d'evolution, milestones et recompenses permanentes pendant les challenges.
- Debloquer des milestones et transmettre l'heritage.
- La sauvegarde est automatique dans le navigateur.

## Pacing actuel

La Prehistoire est calibree comme premier layout long, avec 10 nodes visibles progressivement et 5 chaines de progression qui convergent vers `Tribu stable`.

Simulation indicative jusqu'au Neolithique :

- jeu actif regulier : environ 29 minutes ;
- jeu modere : environ 59 minutes ;
- jeu passif : environ 2 h 50.

## Structure

```text
index.html
styles.css
game.js
assets/
```
