# 🚀 Astro Dash

Un jeu mobile d'arcade : un petit astronaute court sur une planète lointaine, et toi tu tapes l'écran pour le faire sauter au-dessus des obstacles. Simple à prendre en main, dur à lâcher.

## Comment jouer

- **Tape l'écran** → sauter
- **Re-tape en l'air** → double saut
- Évite les caisses, les pics et les drones
- Ramasse les **orbes d'énergie** (+25 points chacune)
- La vitesse augmente en continu… survis le plus longtemps possible !

Sur ordinateur : **Espace** ou **Flèche haut** pour sauter.

## Lancer le jeu

C'est du HTML/CSS/JS pur, sans aucune dépendance. Deux options :

**En local :**

```bash
cd astro-dash
python3 -m http.server 8000
# puis ouvre http://localhost:8000 sur ton téléphone (même Wi-Fi) ou ton navigateur
```

**En ligne (GitHub Pages) :** active GitHub Pages sur le dépôt et le jeu sera accessible à l'adresse `https://<ton-user>.github.io/Game1/astro-dash/`.

## Installable comme une appli 📱

Le jeu est une **PWA** : ouvre-le dans Chrome/Safari sur ton téléphone, puis « Ajouter à l'écran d'accueil ». Il se lance alors en plein écran, sans barre d'adresse, et fonctionne même hors ligne.

## Fonctionnalités

- Contrôle à un doigt (tap / double tap), avec « coyote time » pour des sauts tolérants
- Difficulté progressive : la vitesse et la densité d'obstacles augmentent
- 3 types d'obstacles : caisses (parfois doubles), rangées de pics, drones volants
- Orbes bonus disposées en arcs à attraper en plein saut
- Record sauvegardé sur l'appareil (localStorage)
- Effets : parallaxe (étoiles, collines, planète), particules, tremblement d'écran, vibration à la mort
- Sons générés en WebAudio (aucun fichier audio), bouton mute
- Hors ligne grâce au service worker

## Structure

```
astro-dash/
├── index.html            # page + écrans menu / game over
├── style.css             # interface
├── game.js               # tout le moteur du jeu
├── icon.svg              # icône de l'appli
├── manifest.webmanifest  # config PWA
└── sw.js                 # service worker (cache hors ligne)
```
