# FONDATION — LA NOUVELLE CAMPAGNE

> Document de conception, ouvert le **2026-08-15**, après la clôture du Creuset à la scène 299.
> Tout ce qui est ici a été **tranché par le joueur**, jamais posé par le MJ seul.
> **Les règles de conduite de l'ancienne campagne restent en vigueur** — `codex/RULE-MJ.md`, `codex/SEUILS.md`, `codex/MJ-ERRATA.md` (§1-55). C'est le monde qui change, pas la conduite.

---

## 0 · POURQUOI ON REPART

Décision du joueur : *« je veux pas continuer un jeu qui a 1/5ᵉ est basé sur plein de trucs foireux. »* Cinq axes du palier II n'ont jamais été servis en 111 scènes — équipement, économie, chances, réclusions, examens — malgré un corpus qui les exigeait tous.

**La réponse n'est pas une règle de plus.** C'est le compteur d'axes (`.claude/hooks/axes.py`), qui compte ce qui **n'est pas** servi et reprend le MJ avant qu'il rende la main. Une règle qu'on peut oublier doit être portée par un outil, pas par la mémoire.

---

## 1 · LE GENRE

**Xianxia de bout en bout**, y compris à l'étage du bas. Pas wuxia : le wuxia s'interdit le surnaturel et plafonne à l'humain, et ce n'est pas ce que le joueur veut. Dès la première scène : qi, sectes, manuels, pilules, bêtes spirituelles, et tout le monde le sait.

**Conséquence sur le départ** : peser **1** dans un monde de cultivateurs, ce n'est pas être pauvre — c'est **ne pas pouvoir cultiver du tout**. Le déchet, au sens technique. Les gens ne détournent pas les yeux parce qu'il est sale, mais parce qu'il est la preuve vivante que ça peut rater.

---

## 2 · LES QUATRE STRATES

Chaque strate est graduée **de 1 à ~100 000 dans ses propres unités**. Entre deux strates : **×1000**.

| Strate | Unités locales | En unités de la Poussière | Le sommet y fait |
|---|---|---|---|
| **I · La Poussière** | 1 – 100 000 | 1 – 10⁵ | **détruit des montagnes** |
| **II · Le Verger** | 1 – 100 000 | 10³ – 10⁸ | tient un continent, change une saison |
| **III · L'Univers** | 1 – 100 000 | 10⁶ – 10¹¹ | gouverne d'une planète à une galaxie |
| **IV · Le Peu** | 1 – 100 000 | 10⁹ – 10¹⁴ | la règle elle-même |

- **La conversion est un déplacement de virgule** : `175 796` en bas devient `175,796` au-dessus. Aucun chiffre n'est perdu, les relevés restent prononçables jusqu'en haut, et l'instinct garde les décimales quand le reste du monde jauge à la louche.
- **Le sommet de la Poussière — celui qui détruit des montagnes — pèse 100 au Verger.** Pas nul : *quelconque*, avec des paysans à 5 000 autour de lui.
- **Le Verger est extrêmement propice** : ce qui prend vingt ans en bas en prend deux. Contrepartie du genre : tout le monde y pousse vite, la concurrence est féroce, rien n'est laissé sans propriétaire.
- **À L'Univers, le déplacement marque le rang** : en bas on prend un vaisseau ; vers 10¹¹ on traverse le vide par soi-même, et la strate entière le sait.
- **Au Peu**, tout appartient déjà à quelqu'un, et ce quelqu'un se compte par milliers. Plus de sectes, plus de foules : **des individus**, et des **domaines** — une portion de réel où les lois sont les leurs.
- **Aucun plafond, jamais** (errata §29/§49) : les amplitudes se recouvrent, on peut monter en pesant déjà le sommet de la strate d'arrivée.

### 2.1 · Monter est un acte, pas un accident

**Il existe un seuil physique entre deux plans, et quelque chose le tient.** On ne « déborde » pas vers le haut : on y va, on se présente, et on passe — ou pas.

Ce que les gens d'en bas appellent *les Redescendus, les Effacés, les Visions des mourants, le débordement*, ce sont **quatre noms pour la même observation** : quelqu'un qui disparaît. Aucun d'eux n'a jamais vu ce qui se passe réellement. **Ceux qui montent sans passer par le seuil arrivent en rebut, sans rien.**

---

## 3 · LE FAMILIER — LE CŒUR DU JEU

**Rite d'invocation obligatoire** pour tous. C'est là que se décide une vie, et c'est la scène 1.

**Un seul chiffre pour la paire.** Ce que l'un gagne, l'autre le porte.

**Ce qui reste acquis de l'ancienne campagne** *(règles, pas événements)* : elle a une volonté propre — elle veut, refuse, conteste ; **son corps est son domaine**, ce qu'elle devient ne se négocie pas ; **aucune créance, aucun prélèvement, jamais** ; elle n'est **jamais du décor** (le hook la compte à chaque scène) ; description franche, anthropomorphe assumé ; **aucune romance avant la majorité de Seb**.

### 3.1 · L'échelle — corps et esprit, entrelacés

**L'ordre est fixe** : `1 → A → 2 → 3 → B → C → 4 → 5 → 6`, puis le divin.

| | Palier | Humanité | Âge morpho. | Ce qui change |
|---|---|---|---|---|
| **1** | **LE LAPEREAU** | animal | — | Trente centimètres, quatre pattes, tient dans une main. Personne n'est impressionné. |
| **A** | **ELLE COMPREND** | — | — | Elle réagit à ce qu'il **dit**, pas à son ton. Préférences visibles. Elle refuse en se détournant. |
| **2** | **LA TAILLE** | ~40 % | ~10 ans | Elle grandit jusqu'à un enfant, se dresse sur les pattes arrière, s'assied comme on s'assied. |
| **3** | **LES MAINS** | ~60 % | ~14 ans | Vraies mains. Elle prend, elle tient, elle **rend**. Bipède la plupart du temps. |
| **B** | **ELLE PARLE** | — | — | Des mots d'abord, un par scène. Puis des phrases. Elle énonce, elle nomme. |
| **C** | **ELLE VEUT** | — | — | Des désirs propres, **qui divergent des siens**. Elle demande, elle argumente, elle le fait changer d'avis. |
| **4** | **DEBOUT** | **75 %** | **18 ans — majeure** | Silhouette humaine, debout en permanence, le museau raccourcit. Fourrure encore partout. |
| **5** | **LE VISAGE** | **85 %** | **22 ans** | Visage humain. La fourrure recule vers les membres. |
| **6** | **LA FEMME** | **95 %** | **26 ans** | `refs/lapine-forme-finale.png`. **Atteint à la mi-campagne.** |

**La propriété qui fait tout le sel** : B et C tombent **avant** le 4. Pendant tout un pan de campagne, elle discute, elle conteste et elle veut des choses **avec encore un museau et des pattes**. Les gens verront une bête ; lui saura qu'il vient de perdre une discussion contre elle.

**« Majeure au 4 »** verrouille la règle de romance dans le corps du personnage au lieu d'une note en marge : il n'y a rien à surveiller, la morphologie s'en charge.

### 3.2 · Après le 6 — le divin

Elle ne devient pas plus humaine (le 100 % lui coûterait ses oreilles et sa queue). Elle devient **autre chose**, sur la seconde moitié de campagne :

- **7 · LE HALO** — un anneau de lumière derrière elle, permanent. Les gens le voient, personne ne sait le nommer. Premier signe qu'elle n'est plus de la catégorie « familier ».
- **8 · LES AILES** — quelque chose s'ouvre dans son dos. Pas des plumes : de la lumière tenue, du voile, quelque chose qui porte sans avoir d'aile.
- **9 · CE QU'ON NE REGARDE PLUS EN FACE** — le monde réagit à sa présence seule. Les gens s'écartent sans savoir pourquoi, les instruments s'affolent, les bêtes se couchent. Elle n'a plus rien à faire.

### 3.3 · Les deux moteurs — le point de conception le plus important

**Le corps monte en absorbant ce qui est au-dessus d'elle** : une grosse pièce, une relique, le cœur d'une épreuve, un lieu qui teste. **Pas la puissance du porteur** — quelque chose qu'ils sont allés chercher exprès.

**L'esprit (A, B, C) monte par ce qu'ils traversent ensemble** — les moments qui comptent, pas les victoires.

> **Conséquence assumée : on ne fait pas d'elle quelqu'un en écrasant des gens.** Il est mécaniquement possible d'atteindre le sommet d'une strate avec une bête magnifique qui ne vous a jamais adressé la parole.

Ce choix répond directement à l'audit du psy du 2026-08-15 : sur 320 scènes, **aucun sommet déclaré du joueur n'était une capacité** — c'étaient « Petit. », le refus, l'écart entre son appétit et le sien. Le corps et l'esprit devaient donc cesser d'être la même jauge.

**Bénéfice d'outillage** : le déclencheur du corps met sous contrôle direct du joueur les deux axes les plus ratés du palier précédent — **les chances et la grosse pièce** — et le hook les compte déjà.

### 3.4 · CE QUI LA REND ANORMALE — elle veut donner, il veut prendre

*Tranché le 2026-08-15, après quinze pistes rejetées et un audit du psy qui a montré pourquoi : elles répondaient toutes à « qu'est-ce qu'elle sait faire que les autres ne savent pas ? », alors qu'aucun sommet déclaré du joueur sur 320 scènes n'a jamais été une capacité. La bonne question était **« qu'est-ce qu'elle veut que lui ne veut pas ? »**.*

**La réponse est dans le mythe, pas dans une mécanique inventée.** Le lièvre de jade pile l'élixir d'immortalité sur la lune depuis les Royaumes Combattants — et il y est arrivé parce que, mis à l'épreuve sans rien à offrir, **il s'est jeté lui-même dans le feu pour se donner à manger**. Le lièvre ne symbolise ni la ruse ni la vitesse : il symbolise **le don de soi**.

**ELLE PILE.** Ce n'est pas un pouvoir, c'est sa nature. Toute matière chargée qu'ils rapportent — une prise, un cœur d'épreuve, une relique — elle la **transforme**. Et ce qui sort de son mortier **ne vaut que donné à quelqu'un d'autre** : entre ses mains, ça ne sert jamais à celui qui l'a fabriqué.

- **Il monte en prenant, elle existe en rendant.** Deux natures opposées attachées au même chiffre : c'est le moteur permanent de la paire, pas un désaccord ponctuel.
- **Le choix de à qui ça va lui appartient.** C'est là qu'elle le contredit, et son refus est légitime.
- **Ça remplit structurellement deux axes ratés au palier précédent** : l'économie (elle fabrique ce que ce monde veut le plus) et l'équipement (au xianxia, les pilules *sont* l'équipement). Et ça donne une raison d'aller chercher les **chances** et les **grosses pièces** : c'est sa matière première.

**LE REVERS — quand il n'y a rien à piler, elle se pile elle-même.** Son mythe d'origine, appliqué. Son corps est son domaine (§47), donc **on ne l'en empêche pas** : on peut seulement faire en sorte qu'elle ait autre chose sous la main.

> ⛔ **Ce n'est ni une taxe, ni une créance, ni un prélèvement** (errata §40, règle dure). Rien n'est ponctionné sur ce qu'il prend. C'est une volonté propre qu'il peut nourrir ou négliger — et le prix, quand il la néglige, se joue **en scène et entre eux**, jamais en malus chiffré. À servir **rare et dramatique**, jamais comme une jauge de culpabilité.

### 3.5 · AU DÉBUT, ELLE EST CE QU'ON REGARDE — PAS ENCORE QUELQU'UN

*Tranché par le joueur le 2026-08-16, sur question du psy.*

Le psy a relevé la tension : le palier **C** (elle veut, elle argumente) tombe très loin, et les deux garde-fous posés par le joueur — **rien de prélevé, rien d'économique** — ont volontairement amaigri le seul geste où elle décide. Donc sur les premières dizaines de scènes, ce qui la rend présente, c'est le **regard du monde sur elle**. Or le regard du monde sur elle n'est pas sa volonté à elle.

**Le joueur a tranché : c'est voulu.** *« Qu'elle soit d'abord ce que le monde regarde, et qu'elle devienne quelqu'un plus tard. »*

- **Au début, sa présence en scène passe par ce que les autres en font** : on la moque, on la jauge, on l'écarte, on parie sur elle, on refuse de la prendre au sérieux. Elle subit le monde et elle le regarde.
- **Ce qu'elle veut arrive avec les paliers**, dans l'ordre déjà fixé : elle comprend (**A**), elle parle (**B**), elle veut contre lui (**C**). Pas avant.
- **Le jour où elle bascule d'objet à sujet est un événement de campagne**, pas une progression douce. C'est le moment où celui qui la regardait cesse d'être le sujet de la phrase.

> ⚠ **Conséquence pour l'axe `bete` du compteur** (une ligne par scène, jamais du décor) : *jamais du décor* **ne veut pas dire** *une volonté propre*. Au début, l'axe se sert par ce que le monde lui fait et par ce qu'elle fait d'animal — pas en lui prêtant des intentions qu'elle n'a pas encore. **Lui donner une volonté avant le palier C est une faute**, au même titre que la laisser en décor.

### 3.6 · Rythme

Neuf jalons avant le 6, atteint à mi-campagne : **un tous les ~50 scènes**. Puis trois paliers divins sur la seconde moitié. Le moteur n'est jamais à l'arrêt, et il ne peut plus caler en silence : le compteur d'axes sonne.

---

## 4 · LES RÉFÉRENCES VISUELLES

`refs/lapine-forme-finale.png` — la forme finale, validée après une trentaine d'essais. C'est le **point d'arrivée**, pas le départ.
`refs/lapine-tenue-figee.txt` — la tenue au détail près, plus la manière de demander le velours.

Toute image d'elle passe la référence au générateur (`-i`), et le prompt ne décrit que **ce qui change**. Sans ça, chaque tirage est indépendant et elle change de visage d'une scène à l'autre.

---

## 5 · CE QUI RESTE À DÉCIDER

- **Le nom de la campagne** et celui du personnage principal.
- **Le début** : le rite, où, devant qui, et ce qui se passe quand rien ne sort.
- **Le contenu de la strate I** : douze chances, dix grosses pièces, quinze objets, une économie, cinq réclusions — **écrit avant la scène 1** (errata §39 : un palier se construit avant d'y jouer).
- **L'espèce est fixée : le lièvre** — les six paliers de son corps sont établis et illustrés (`refs/`). Reste à décider ce que les gens de ce monde *pensent* d'un familier-lièvre : dans un monde de prédateurs, invoquer une proie n'est probablement pas un bon présage.
