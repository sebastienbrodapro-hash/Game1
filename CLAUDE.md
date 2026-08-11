# CLAUDE.md

Cette branche (`main`) contient **le jeu d'histoire IA** : un jeu de rôle solo mené par Claude en Maître du Jeu — c'est l'objet des sessions de jeu.
Fichiers : `codexcreuset.md` (état courant de la campagne « Le Creuset »), `codex/` (sauvegardes numérotées + `INDEX.md`, coffre `MJ-SECRETS.md`, errata `MJ-ERRATA.md`, arbre `MJ-ARBRE.md`), `codexjiwen.md` (ancienne campagne « Le Parieur », close).

Le jeu incrémental JS (`game.js`, `index.html`, `styles.css`) vit sur la branche **`chronique-incrementale`** — sans rapport avec les sessions de jeu de rôle, ne pas y toucher.

## Reprendre la partie

Quand le joueur demande à jouer ou reprendre : lire `codex/MJ-INDEX.md` **en premier** — il pilote la lecture du corpus MJ **en silence** (SECRETS, ERRATA, ARBRE, CHRONO en entier ; MONDE, CASTING par chapitres) — puis `codexcreuset.md` **en entier**, l'INDEX des sauvegardes et le git log récent — **la cohérence prime sur l'économie**. Reprendre au « Point de reprise » (§7), en respectant strictement le méta (§1). Tout se joue **en français**, répliques courtes, rythme soutenu.

## Rappels méta critiques (détail complet dans le codex §1)

- **Jets d100 réels** via commande terminal : le chiffre reste masqué au joueur, seule la **bande** est annoncée — le script n'imprime que la bande, le MJ lui-même ne voit pas le naturel. Jamais de jet inventé ou choisi.
- Pronostic **qualitatif** avant chaque choix chiffré (petit/moyen/gros avantage ou désavantage) — jamais de tables ni de seuils.
- Choix affichés directement sur PC ; sur mobile, seulement quand le joueur envoie « `.` ». Libellés très courts.
- **Prénoms occidentaux** pour tous les personnages. Personnage principal : **Seb**.
- Le monde est écrit d'avance : les éléments scellés côté MJ ne sont jamais révélés au joueur ni modifiés.
- **Cloison MJ/joueur (codex §1.8)** : le coffre n'est jamais cité ni paraphrasé ; **aucun nom propre du coffre** avant la scène qui le livre (en jeu, la bête s'appelle « la bête ») ; fiction et méta jamais mélangés dans le même message ; un nom fuité est brûlé (voir `codex/MJ-ERRATA.md`).
- Réglage joueur (codex §1.7) : **Opus 5, effort extra, sans bascule** — le MJ ne le change pas et ne le rappelle pas.

## Sauvegarde — quand le joueur dit `codex`

1. Régénérer `codexcreuset.md` (état complet à jour : fiche, portes, casting, point de reprise).
2. Le copier vers `codex/codex-NNN.md` (numéro suivant) et ajouter la ligne dans `codex/INDEX.md`.
3. Commit, **tag annoté `codex-NNN`**, push (`git push && git push origin codex-NNN`).
   En session cloud (push de tags refusé) : sauter le tag, copies + index font foi.
