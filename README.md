# Chronique Incrémentale

Jeu web incrémental historique en HTML, CSS et JavaScript vanilla.

> 🔥 Ce dépôt contient aussi un second projet : **[La Voie des Cendres](voie-des-cendres/)**, un RPG textuel de cultivation martiale sous Godot (choix multiples, fiche de personnage, secrets cachés, APK Android). Voir [voie-des-cendres/README.md](voie-des-cendres/README.md).

Le projet part d'un arbre de progression inspiré des tree incrementals (Antimatter Dimensions, Celestial Incremental) : époques historiques, jalons, challenges, milestones et transmission/prestige.

## Lancer depuis Git

```bash
git clone https://github.com/sebastienbrodapro-hash/Game1.git
cd Game1
```

Ouvrir ensuite `index.html` dans le navigateur.

Aucun serveur local et aucune dépendance ne sont nécessaires.

## Boucle de jeu

- Le clic ne donne qu'une seule ressource : les Points d'évolution. Tout le reste est produit passivement par les métiers.
- Le premier métier de chaque époque ne coûte que de l'évolution : aucune impasse possible.
- Suivre le fil conducteur, de la Préhistoire au Futur.
- Acheter des métiers et des jalons dans les deux arbres de l'époque active.
- Franchir des paliers de 10 producteurs pour obtenir des sauts de production (×1,85).
- Débloquer des challenges via des jalons d'épreuve dans l'arbre.
- Découvrir des Reliques (objets historiques) à des seuils cachés : bonus permanents, conservés à travers les prestiges, bonus de collection par époque.
- Transmettre l'héritage pour payer l'Armée des âges : un arbre de prestige qui parcourt les époques (guerriers du clan → hoplites → chevaliers bannerets → blindés → essaim nanite).
- La Force de frappe de l'armée multiplie toute la production et ouvre des Campagnes à récompenses uniques.
- L'armée débloque l'automatisation : actions automatiques (Tambours de guerre, Réseau radio) et achats automatiques (Intendance, Quartiers-maîtres).
- Les nodes « Mémoire » gardent les époques débloquées après transmission.
- La sauvegarde est automatique dans le navigateur, et la production continue en arrière-plan (~1 tick/s).

## Interface

- Thème sombre atmosphérique ; chaque époque teinte l'interface de sa couleur.
- Arbres façon « Hex of Power » (Celestial Incremental) : nodes compacts reliés par des branches, achat au clic direct sur le node.
- Détails (description, coûts avec possédé/requis, production, prérequis, effets) dans une infobulle au survol.
- Sélecteur d'achat ×1 / ×10 / Max pour les métiers.
- Toasts d'événements : paliers atteints, jalons et métiers révélés, époque débloquée, épreuve prête.
- Rendu incrémental : l'arbre n'est reconstruit qu'aux achats, les états (abordable, en attente, verrouillé) sont mis à jour en continu.

## Révélation progressive

Le jeu démarre quasi vide : un bouton d'action et le compteur d'évolution. Chaque système est un tournant qui se débloque en jouant, avec une cinématique dédiée : l'Arbre des métiers, le Fil historique, les Paliers, les Époques, les Crises, les Reliques, puis l'Armée des âges. Les features encore verrouillées restent visibles dans la barre latérale avec leur condition — des murs qui annoncent la suite.

## Contenu actuel

- Préhistoire : 10 jalons, 7 métiers en chaînes, premier layout long.
- Néolithique : 11 jalons, 7 métiers, 2 challenges (Grande sécheresse, Hiver volcanique).
- Antiquité : 11 jalons, 6 métiers, 2 challenges (Guerres puniques, Crise de la République).
- Moyen Âge : 11 jalons (charrue, monastères, hanse, cathédrales, chevalerie, horloges, communes libres…), 7 métiers, 2 challenges.
- Renaissance : 11 jalons (mécénat, perspective, partie double, anatomie, observatoires, héliocentrisme…), 7 métiers, 2 challenges.
- Industrie → Futur lointain : squelettes à enrichir sur le même modèle.

## Pacing

La Préhistoire est calibrée comme premier layout long, avec 10 jalons révélés progressivement et 5 chaînes de progression qui convergent vers `Tribu stable`. Le Néolithique et l'Antiquité suivent la même logique : chaque jalon révèle la suite de l'arbre et ouvre de nouveaux métiers.

## Structure

```text
index.html
styles.css
game.js
assets/
```
