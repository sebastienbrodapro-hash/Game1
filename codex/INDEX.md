# Index des sauvegardes — GAME1 (jeu d'histoire IA)

Chaque fois que le joueur dit `codex`, le MJ régénère le document, met à jour
le codex racine (toujours la dernière version), ajoute une copie figée
`codex/codex-NNN.md` et une ligne ici — un commit par sauvegarde.

> Sessions sans git (connecteur seul) : pas de tag — copies + index font foi.
> Sessions avec git : poser AUSSI le tag annoté —
> `git tag -a codex-NNN <commit> -m "<situation>" && git push origin codex-NNN`

| Version | Commit | Date | Campagne | Situation |
|---|---|---|---|---|
| codex-001 | de75a9b | 2026-08-10 | Le Parieur (Ji Wen) — close | Ling Wu, Jour 2, aube — juste avant la première épreuve |
| codex-002 | 7c8f090 | 2026-08-10 | **Le Creuset (Seb)** | v2 figée — veille de la pesée, scène 1 à jouer |
| codex-003 | tag `codex-003` | 2026-08-10 | **Le Creuset (Seb)** | v3 — Scène 1 jouée ; matin de la pesée, jet 1 à venir ; §1.7 Économie ajouté |
| codex-004 | 59ef595 | 2026-08-10 | **Le Creuset (Seb)** | **v4 — fiction remise à zéro : reprise au tout début (veille de la pesée, rien joué).** Masque conservé ; §0.1 résumé en clair ; §1.8 cloison MJ/joueur ; `codex/MJ-ERRATA.md` créé (nom scellé brûlé) |
| codex-005 | (connecteur) | 2026-08-10 | **Le Creuset (Seb)** | **v5 — §1.9 Format de rendu** : bloc ÉTAT + horloges à chaque scène, images = liste fermée des scènes marquantes, étiquette de famille par option (exemple canonique inclus) ; §7 « aucun jet avant la pesée » ; **mère de Seb canonisée**. Reprise inchangée : tout début, rien joué |
| codex-006 | 0468deb | 2026-08-11 | **Le Creuset (Seb)** | **v6 — première session jouée.** Scènes 1-3 : lit sec (paume sur la pierre creuse), matin avec la mère, **pesée** — premier d100 de la partie, bande **36-65** (+1 jeton). Affiché **1**, réel 3, Masque acquis en scène, bête sans espèce inscrite *rat commun*. Nouveau don **§3.6 instinct du chiffre** · **§2.5 Le Fond** · casting : mère, greffier (seconde feuille), fille au chat-des-toits (6). **Reprise : place basse juste après la pesée — bloc de choix en attente reproduit au §7** |
| codex-007 | tag `codex-007` | 2026-08-11 | **Le Creuset (Seb)** | **v7 — grosse session : scènes 4-21.** Seb **3 → 9** (deux dévorations), affiché toujours **1**. **1 catastrophe** (la seconde feuille part au chef-lieu — porte fermée) et **3 triomphes** (légende du Fond · Armand, le Corps devient un travail · Anselme devient son courtier). **Seb apprend qu'il est seul au monde** (Margot, §3.3). Casting : Jeanne, Margot, Berthe, Armand, Anselme, Gilles, Odile. Nouvel objet **§3.7 la plaque de fer creusée**. Règles changées : **§1.1 portes (ouvrir OU élargir)**, **§1.4 familles refondues** (Libre restreint, Noir = étiquette cumulable, pas de quota), **§1.7 Opus 5 effort max + rapide**, **§1.9 photos web only + pronostics courts**, **§2.4 le chiffre monte mais ne bouge jamais à vue et ne redescend jamais**. **Reprise : contrat Anselme sur la table, plume tendue — bloc au §7** |
| codex-008 | 9040ff6 | 2026-08-11 | **Le Creuset (Seb)** | **v9 — sauvetage + scènes 21-40.** La session locale qui a joué ces vingt scènes s'est terminée sur **trois `codex` avortés (réseau)** : rien n'avait été sauvegardé. Scènes rapatriées et figées dans **`codex/SESSION-21-40.md`** (archive scène par scène), synthèse intégrée dans le codex racine. **Seb 9 → 22 (Souffle)** en dévorant une chose à 13 ; **affiché 14 inscrit au registre** (plancher public définitif, réserve cachée 8) ; troisième trait **la griffe**. **Contrat signé au dixième, Anselme répondant** ; **Margot vivante au registre**. Révélé : **les Rayeurs**, l'**escalier de procession** et la **salle noyée** sous le Fond, la **salle sèche à 200 bancs** et sa pierre docile, **Armand ancien soigneur du Verger Blanc**. **5 portes de plus** (§5) : répondant *(élargie)*, sous le lit sec, Margot ta tête, **un corps intact (fermée à vie)**, le Masque étalonné, **passer inaperçu (fermée à vie)**. **Le contrôle public est clos** — anomalie classée en panne de matériel, et le vérificateur a écrit une seconde feuille. **Reprise : place basse, fin de J7 — bloc au §7** |

> **Note :** pas de copie figée `codex/codex-008.md` cette fois — la sauvegarde a été faite par le connecteur depuis un fil mobile, sans git local. La prochaine session Claude Code peut la poser gratuitement :
> `cp codexcreuset.md codex/codex-008.md && git add -A && git commit -m "copie figee codex-008" && git tag -a codex-008 9040ff6 -m "v9 - fin du controle au Fond" && git push origin main --tags`
