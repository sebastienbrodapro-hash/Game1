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

**Ce qui reste acquis de l'ancienne campagne** *(règles, pas événements)* : **son corps est son domaine**, ce qu'elle devient ne se négocie pas — **dès l'origine, et sans attendre aucun palier** ; **aucune créance, aucun prélèvement, jamais** ; elle n'est **jamais du décor** (le hook la compte à chaque scène) ; description franche, anthropomorphe assumé ; **aucune romance avant la majorité des deux** — la sienne à elle est au palier 4 (§3.1), et Seb part **majeur** (dix-huit ans, §6.2).

**Ce qui n'est PAS acquis d'entrée : la volonté.** Elle *aura* une volonté propre — elle voudra, refusera, contestera — mais **à partir du palier C**, pas avant (§3.5). Le veto sur son corps n'est pas une volonté : c'est un refus animal, et il vaut dès la scène 1.

### 3.1 · L'échelle — corps et esprit, entrelacés

**L'ordre est fixe** : `1 → A → 2 → 3 → B → C → 4 → 5 → 6`, puis le divin.

| | Palier | Humanité | Âge morpho. | Ce qui change |
|---|---|---|---|---|
| **1** | **LE LAPEREAU** | animal | — | Trente centimètres, quatre pattes, tient dans une main. Personne n'est impressionné. |
| **A** | **ELLE COMPREND** | — | — | Elle réagit à ce qu'il **dit**, pas à son ton. Préférences visibles. Elle refuse en se détournant. |
| **2** | **DEBOUT** | ~40 % | ~10 ans | Elle grandit jusqu'à un enfant. **Torse vertical, épaules, bras** — mais des pattes au bout. C'est aussi là qu'apparaît le museau. |
| **3** | **LES MAINS** | ~60 % | ~14 ans | Vraies mains, cinq doigts. Elle prend, elle tient, elle **rend**. Profil plat : plus de museau. |
| **B** | **ELLE PARLE** | — | — | Des mots d'abord, un par scène. Puis des phrases. Elle énonce, elle nomme. |
| **C** | **ELLE VEUT** | — | — | Des désirs propres, **qui divergent des siens**. Elle demande, elle argumente, elle le fait changer d'avis. |
| **4** | **LA SILHOUETTE** | **75 %** | **18 ans — majeure** | Silhouette humaine, **et un visage humain aux traits de lièvre**. Fourrure encore partout. |
| **5** | **LE VISAGE** | **85 %** | **22 ans** | Visage **entièrement** humain. La fourrure recule vers les membres. |
| **6** | **LA FEMME** | **95 %** | **26 ans** | `refs/lapine-forme-finale.png`. Oreilles et queue, rien d'autre. |

> **`refs/` fait foi sur la morphologie** *(aligné le 2026-08-16)* : les six paliers ont été générés du dernier au premier et **validés cran par cran par le joueur**, ce texte non. La règle de composition qui en sort : **75 % d'humanité veut dire une femme aux traits de lièvre, jamais un lièvre aux traits humains.** Les invariants — les yeux vert jade pâle, le pompon, aucune dent visible, pas de griffes — sont dans `refs/README.md` et ne bougent sur aucun palier.

**La propriété qui fait tout le sel** : B et C tombent **avant** le 4. Pendant tout un pan de campagne, elle discute, elle conteste et elle veut des choses **avec encore un museau et des pattes**. Les gens verront une bête ; lui saura qu'il vient de perdre une discussion contre elle.

**« Majeure au 4 »** verrouille la règle de romance dans le corps du personnage au lieu d'une note en marge : il n'y a rien à surveiller, la morphologie s'en charge.

### 3.2 · Après le 6 — le divin

Elle ne devient pas plus humaine (le 100 % lui coûterait ses oreilles et sa queue). Elle devient **autre chose**, sur la seconde moitié de campagne :

- **7 · LE HALO** — un anneau de lumière derrière elle, permanent. Les gens le voient, personne ne sait le nommer. Premier signe qu'elle n'est plus de la catégorie « familier ».
- **8 · LES AILES** — quelque chose s'ouvre dans son dos. Pas des plumes : de la lumière tenue, du voile, quelque chose qui porte sans avoir d'aile.
- **9 · CE QU'ON NE REGARDE PLUS EN FACE** — le monde réagit à sa présence seule. Les gens s'écartent sans savoir pourquoi, les instruments s'affolent, les bêtes se couchent. Elle n'a plus rien à faire.

> ⛔ **VERROUS DE STRATE** *(joueur, 2026-08-18)* : **le 7 pas avant la strate II** ; **le 8 et le 9 pas avant la strate III**. Et ce qui la nourrit après le 6 est **divin** — jamais fabriqué sur mesure : *« quand je monterai, ce sera ce qu'elle trouvera — pas avant. »* Sa faim reste ouverte et pèse dans les scènes ; le MJ ne la comble pas au calendrier.

### 3.3 · Les deux moteurs — le point de conception le plus important

**Le corps monte en absorbant ce qui est au-dessus d'elle** : une grosse pièce, une relique, le cœur d'une épreuve, un lieu qui teste. **Pas la puissance du porteur** — quelque chose qu'ils sont allés chercher exprès.

> ⛔ **« AU-DESSUS D'ELLE » = AU-DESSUS DE SA DERNIÈRE PRISE.** *(Clarifié le 2026-08-16, sur faute : le MJ avait lu « au-dessus du chiffre de la paire » et refusé un cran acquis.)* Jamais au-dessus du chiffre commun — **elle n'a pas de chiffre propre** (`SYSTEMES` §0.2 : aucune répartition, un seul chiffre), et adosser son cran au total la bloquerait définitivement, puisque le qi fait monter ce total bien plus vite que les proies ne grossissent. Le seuil, c'est **la plus grosse chose qu'elle ait déjà mangée**. Une prise plus lourde que la précédente donne un cran, **dans la scène même** (§51).

**L'esprit (A, B, C) monte par ce qu'ils traversent ensemble** — les moments qui comptent, pas les victoires.

> **Conséquence assumée : on ne fait pas d'elle quelqu'un en écrasant des gens.** Il est mécaniquement possible d'atteindre le sommet d'une strate avec une bête magnifique qui ne vous a jamais adressé la parole.

Ce choix répond directement à l'audit du psy du 2026-08-15 : sur 320 scènes, **aucun sommet déclaré du joueur n'était une capacité** — c'étaient « Petit. », le refus, l'écart entre son appétit et le sien. Le corps et l'esprit devaient donc cesser d'être la même jauge.

**Bénéfice d'outillage** : le déclencheur du corps met sous contrôle direct du joueur les deux axes les plus ratés du palier précédent — **les chances et la grosse pièce** — et le hook les compte déjà.

### 3.4 · CE QUI LA REND ANORMALE — elle veut donner, il veut prendre

*Tranché le 2026-08-15, après quinze pistes rejetées et un audit du psy qui a montré pourquoi : elles répondaient toutes à « qu'est-ce qu'elle sait faire que les autres ne savent pas ? », alors qu'aucun sommet déclaré du joueur sur 320 scènes n'a jamais été une capacité. La bonne question était **« qu'est-ce qu'elle veut que lui ne veut pas ? »**.*

**La réponse est dans le mythe, pas dans une mécanique inventée.** Le lièvre de jade pile l'élixir d'immortalité sur la lune depuis les Royaumes Combattants — et il y est arrivé parce que, mis à l'épreuve sans rien à offrir, **il s'est jeté lui-même dans le feu pour se donner à manger**. Le lièvre ne symbolise ni la ruse ni la vitesse : il symbolise **le don de soi**.

**ELLE PILE.** Ce n'est pas un pouvoir, c'est sa nature. Toute matière chargée qu'ils rapportent — une prise, un cœur d'épreuve, une relique — elle la **transforme**. Et ce qui sort de son mortier **ne vaut que donné à quelqu'un d'autre** : entre ses mains, ça ne sert jamais à celui qui l'a fabriqué.

- **Il monte en prenant, elle existe en rendant.** Deux natures opposées attachées au même chiffre : c'est le moteur permanent de la paire, pas un désaccord ponctuel.
- **Le destinataire est son choix à elle, jamais négociable.** Mais **ce choix ne s'argumente pas avant le palier C** : au début, c'est un geste — elle pose la chose devant quelqu'un, et c'est tout. **Elle ne plaide pas, elle ne conteste pas, elle ne le fait pas changer d'avis** : ça, c'est C (§3.5).
- **⛔ CE N'EST PAS UNE ÉCONOMIE** (recadrage du joueur du 2026-08-16, **canon dur** — repris tel quel par le monde neuf). Ni revenu, ni filière, ni actif, ni matière première. **Aucun débit, aucun rendement, aucun canal, aucune règle d'activation à optimiser.** Ce qu'elle pile produit **des scènes**, pas des ressources — et si Seb en profite un jour, c'est qu'elle a décidé de le lui donner : **un moment, pas une ressource.** L'économie du monde (`CENT-VALLEES` §5.0) tient debout sans elle, et l'axe `marchandage` se sert **avec le monde, jamais avec elle**.
- **Les chances et les grosses pièces se cherchent pour elles-mêmes** — parce que c'est ce que le joueur aime, et parce que le corps de la compagne monte en absorbant (§3.3). Pas « pour l'approvisionner ».

**LE REVERS — quand il n'y a rien à piler, elle se pile elle-même.** Son mythe d'origine, appliqué. Son corps est son domaine (§47), donc **on ne l'en empêche pas** : on peut seulement faire en sorte qu'elle ait autre chose sous la main. **Rare et dramatique, jamais une jauge.**

> ⛔ **Ce n'est ni une taxe, ni une créance, ni un prélèvement** (errata §40, règle dure). Rien n'est ponctionné sur ce qu'il prend. **Toute résurgence en rendement, tarif ou filière est une faute au même titre qu'une dîme.** Les offres qui la traitent comme un actif se servent **pour qu'il ait le plaisir de les refuser** — jamais pour qu'il cède. Le prix, quand il la néglige, se joue **en scène et entre eux**, jamais en malus chiffré.

### 3.5 · AU DÉBUT, ELLE EST CE QU'ON REGARDE — PAS ENCORE QUELQU'UN

*Tranché par le joueur le 2026-08-16, sur question du psy.*

Le psy a relevé la tension : le palier **C** (elle veut, elle argumente) tombe très loin, et les deux garde-fous posés par le joueur — **rien de prélevé, rien d'économique** — ont volontairement amaigri le seul geste où elle décide. Donc sur les premières dizaines de scènes, ce qui la rend présente, c'est le **regard du monde sur elle**. Or le regard du monde sur elle n'est pas sa volonté à elle.

**Le joueur a tranché : c'est voulu.** *« Qu'elle soit d'abord ce que le monde regarde, et qu'elle devienne quelqu'un plus tard. »*

- **Au début, sa présence en scène passe par ce que les autres en font** : on la moque, on la jauge, on l'écarte, on parie sur elle, on refuse de la prendre au sérieux. Elle subit le monde et elle le regarde.
- **Ce qu'elle veut arrive avec les paliers**, dans l'ordre déjà fixé : elle comprend (**A**), elle parle (**B**), elle veut contre lui (**C**). Pas avant.
- **Le jour où elle bascule d'objet à sujet est un événement de campagne**, pas une progression douce. C'est le moment où celui qui la regardait cesse d'être le sujet de la phrase.

> ⚠ **Conséquence pour l'axe `bete` du compteur** (une ligne par scène, jamais du décor) : *jamais du décor* **ne veut pas dire** *une volonté propre*. Au début, l'axe se sert par ce que le monde lui fait et par ce qu'elle fait d'animal — pas en lui prêtant des intentions qu'elle n'a pas encore. **Lui donner une volonté avant le palier C est une faute**, au même titre que la laisser en décor.

> **§3.5 PRIME SUR §3.4 ET SUR §3** *(c'est la décision la plus récente du joueur, et le palier C tombe désormais vers la scène 25-40)*. Partout où un texte plus ancien prête à la compagne une volonté « dès l'origine », c'est §3.5 qui gagne. **La seule chose qu'elle refuse avant C, c'est ce qu'on veut faire de son corps** (§47) — un refus animal, pas un argument.

## 2bis · LA PUISSANCE — Corps + Qi, et les arts en dehors

*Tranché par le joueur le 2026-08-16 : « le corps et la puissance sont liés. Un corps fort sans qi vs un qi fort sans corps peuvent être égaux, et l'ensemble des 2 fait la puissance. Juste les compétences peuvent donner de la puissance invisible. »*

**Le chiffre d'un être est la somme de son CORPS et de son QI.** Deux réservoirs distincts qui s'additionnent : un lutteur au corps de bronze sans une goutte de qi pèse autant qu'un disciple frêle qui a passé dix ans assis. **Le chiffre ne dit pas lequel est lequel.**

- **Aucun instrument ne rend la composition** — et **l'instinct de Seb non plus** : il lit le total exact, jamais la répartition. Le seul terrain où son don ne le dispense pas de regarder.
- **Ni les arts ni l'équipement ne comptent** : c'est de la **puissance invisible**. **Le chiffre mesure ce qu'on EST, jamais ce qu'on A.** Un homme à 3 000 qui connaît un art inconnu, ou qui porte ce que personne n'a identifié, bat un homme à 5 000 qui n'a ni l'un ni l'autre — et rien ne l'avait annoncé.
- **Pour Seb** : sa part de qi est nulle. Tout ce qu'il pèse vient du **corps** et de ce qui lui est **donné** — un être bâti à l'exact inverse de tout le monde, dans un monde qui ne mesure que des sommes.

**Le détail des systèmes est dans `monde/SYSTEMES.md`** : le Corps et ses cinq grades, les arts et leurs crans, les portes et leur démarrage à zéro, les trois déclencheurs de son esprit.

## 3ter · LA DURÉE D'UNE CHASSE — 1 à 5 scènes

*Tranché par le joueur le 2026-08-16, sur défaut relevé en audit.*

Le tronc avait appliqué à une chasse la règle **« un jalon se consomme en 1-2 scènes »** — une directive anti-longueur qui visait les jalons, pas les prises. Or la grosse pièce est le **sommet de plaisir n°1** du joueur, et son meilleur souvenir de chasse n'a pas duré deux scènes.

**Une grosse pièce se joue en 1 à 5 scènes.** L'approche, le terrain, ce qu'elle fait pour se défendre, ce qu'elle coûte : tout ça a le droit d'exister. La règle des 1-2 scènes reste valable pour **les autres formes de jalons** — ce qui ne doit ni traîner ni devenir un arc.

## 3bis · CE QUI EST VALIDÉ ET NE SE « CORRIGE » PLUS

*Tranché par le joueur le 2026-08-16, en réponse à l'audit du psy sur le monde neuf.*

Le psy avait signalé trois risques dans `monde/POUSSIERE.md`. Le joueur en a écarté deux **explicitement** — ils sont donc du canon, et toute passe d'audit ultérieure qui voudrait les « réparer » commet une faute :

- **L'ÉCONOMIE PEUT ÊTRE GROSSE.** *« économie importante ça me va. »* Quatre monnaies, la table de prix, les bourses-types : c'est voulu. Le héros commence garçon de courses d'une halle — il connaît les prix et les pesées avant de peser quoi que ce soit, et c'est son arme, pas une corvée. **La limite reste l'errata §28** : ce qui s'achète et se paie se règle **en une ligne de fiche**, jamais en scène — sauf si quelque chose peut casser.
- **UN PEU DE SOCIAL EST BIENVENU.** *« un peu de sociale ça me va. »* Des proies protégées par une communauté, un interdit, une réputation : légitime **en variété**. La limite reste l'errata §42 : le social est de la **friction**, jamais un adversaire, et la domination se joue en **une** scène spectaculaire — jamais en arc de négociation.

- **« DEVINETTE » NE COUVRE QUE L'ÉNIGME À RÉSOUDRE.** *(Tranché le 2026-08-16.)* Une protection qui oblige à **savoir où elle est, quand exactement, ou laquelle c'est** avant de pouvoir frapper **n'entre pas dans l'exception** : c'est une énigme au sens de l'errata §31, et §31.3 y range explicitement les problèmes de dates et de moments. Toute proie ou chance qui repose là-dessus doit voir sa protection **retournée en obstacle physique ou de terrain**.
- **LA PROIE QU'IL FAUT IDENTIFIER RESTE, ET ELLE RESTE SEULE.** *« 1 devinette me tuera pas. »* Sur quinze proies, **une** demande d'être reconnue avant d'être frappée — et c'est précisément parce qu'elle est unique qu'elle vaut : une exception qui fait ressortir les quatorze autres, pas un mode de jeu. **Aucune seconde du même genre ne s'ajoute**, dans cette strate ni dans les suivantes. L'errata §31 reste entier partout ailleurs : pas de révélation par déduction, pas de progression en pourcentage de déchiffrement, pas de tableau d'indices.

### 3.6 · LE RYTHME RÉEL — refondu le 2026-08-18 *(phase psyché ; remplace la version du 2026-08-16)*

**~200 scènes par strate, ~800 la campagne — la strate IV s'atteint pour de vrai.** *« Je veux pas courir et je veux voyager, sinon trop dur de trouver des vraies chances. »* **Le voyage est un contenu, pas un trajet** : les chances et les grosses pièces se trouvent en couvrant du pays.

**Directive de construction du monde** *(pour le chantier monde, gravée ici)* : une strate = **plusieurs régions, plusieurs villes, des routes** — *« 1 ville 1 village c'est pas un monde. »* La strate I neuve se construit **vaste d'entrée**.

| Tranche | Ce qui tombe |
|---|---|
| scènes ~1-50 | `1 · A · 2 · 3 · B · C · 4` — **C au plus tard vers 30-35** |
| ~50-100 | `5` vers ~70-80, puis **`6` vers la ~100ᵉ** — son corps finit quand il finit : *« elle n'a pas à évoluer à tout prix »*, la charnière de strate n'attend pas après elle |
| strate II | **7 · LE HALO** |
| strate III | **8 · LES AILES** |
| strate IV | **9 · CE QU'ON NE REGARDE PLUS EN FACE** |

**Le moteur de l'esprit est chiffré** : **A = 2 · B = 3 · C = 4 moments** (`SYSTEMES` §4.0, nombres dans `SEUILS`) — plus jamais « les moments qui comptent » laissés à l'œil du MJ. **Les budgets sont des caps de composition, jamais des plafonds de puissance** (E.0 : on peut peser au-dessus bien avant de monter).

### 3.7 · Rythme — **voir §3.6**

*Ce paragraphe donnait « un jalon tous les ~50 scènes, le 6 à mi-campagne ». Le joueur a tranché autrement le 2026-08-16 : la cadence réelle et les tranches sont au **§3.6**, et c'est lui qui fait foi.* Ce qui demeure : le moteur n'est jamais à l'arrêt, et il ne peut plus caler en silence — le compteur d'axes sonne.

---

## 4 · LES RÉFÉRENCES VISUELLES

`refs/lapine-forme-finale.png` — la forme finale, validée après une trentaine d'essais. C'est le **point d'arrivée**, pas le départ.
`refs/lapine-tenue-figee.txt` — la tenue au détail près, plus la manière de demander le velours.

Toute image d'elle passe la référence au générateur (`-i`), et le prompt ne décrit que **ce qui change**. Sans ça, chaque tirage est indépendant et elle change de visage d'une scène à l'autre.

---

## 5 · L'ÉTAT RÉEL — CE QUI EST TRANCHÉ, CE QUI RESTE

> ⚠ **Lu depuis le 2026-08-18** : la campagne civet est close (`archive/civet/`). Dans ce §5, **tout ce qui nomme le monde civet** — Neuf-Puits, la halle, la Balance Vide, l'Avant-Jour, la septième hampe, la feuille de départ, le titre « Le Civet » — est de l'**implémentation archivée, à refaire avec le monde neuf**. Les **règles de cadre** qu'il contient (le rythme §3.6, « ce qui se vide se quitte », les points qui ne se « corrigent » plus) restent entières. Le principe dramatique du départ — *le sommet puis la chute, dans la même salle, au rite de la scène 1* — reste cadre.

*Réécrit le 2026-08-16 : la version précédente rouvrait des points déjà tranchés et donnait des quotas faux.*

### 5.1 · Tranché — ne se rediscute plus

- **Le personnage principal : Seb**, **dix-huit ans** *(porté de quinze à dix-huit le 2026-08-18 — joueur : plus aucune porte fermée par l'âge du héros)*. Le métier de départ se refixe avec le monde neuf — la logique reste : il sait quelque chose du monde qui vaut plus que sa bourse.
- **Le début** : le rite du printemps au temple, le cercle de bronze, la cloche, trois souffles, les recruteurs au premier rang, le crieur à la porte — puis la pierre d'éveil sur le parvis (`POUSSIERE` §3.1-3.2). **Ce que la pierre rend sur cette paire-là se joue en scène 1** : le canon fixe le dispositif, pas le résultat.
- **La lecture sociale de l'espèce** : une proie, **c'est pire que rien** — *« Mieux vaut porte close que porte moquée »*. La partition de la salle est écrite dans l'ordre, jusqu'au surnom (`POUSSIERE` §3.3).
- **L'espèce et ses six paliers de corps** : le lièvre, établi et illustré cran par cran (`refs/`, §3.1).
- **Le contenu de la strate I, écrit avant la scène 1** (errata §39) : **17 chances · 15 grosses pièces · 21 objets · 15 rites et examens · 22 occasions de mesure · 7 réclusions · 15 figures d'arrogance × 6 registres · 8 arts · 3 voies sombres**, plus l'économie complète (4 monnaies, 33 lignes de prix) et onze directions de région. `POUSSIERE` **§16** est l'index de service : axe → où piocher.
- **Le rythme** : palier 4 visé entre les scènes 30 et 50, palier C vers 25-40, palier 6 à la charnière strate I / strate II (§3.6).
- **Ce qui ne se « corrige » plus** : l'économie peut être grosse, un peu de social est bienvenu, **une seule devinette dans tout le monde** (§3bis) — et le mortier n'est **pas** une économie (§3.4).
- **⛔ LE FIL EST SON DOMAINE, PAS CELUI DU MONDE** *(tranché par le joueur le 2026-08-19, après une première tentative de campagne perdue — ~60 scènes jamais sauvegardées : « tout tournait autour des fils et des nœuds »)*. Le motif du fil se concentre sur **Seb** : sa vallée d'origine (la Vallée qui File, qu'il quittera), son métier, son art ⟨LE FIL⟩, son fil de potentiel. **Les institutions du monde n'en sont pas** : les titres se prouvent par tailles de bois, les bandes se portent en cuir, aucune secte majeure n'est une secte du fil. Quand un fil compte dans une scène, c'est le sien.
- **⛔ CE QUI SE VIDE SE QUITTE — CE QUI SE TIENT PEUT SE TENIR** *(réponse au psy puis recadrage du joueur, 2026-08-16, scène 10)*. Sur le neuvième puits : *« comme un endroit qu'il vide et qu'il quittera. »* Puis, sur la généralisation abusive du MJ — *« si, mais des vrais lieux, pas un puits. »*
  - **Un lieu-ressource** — puits, gisement, chance, tanière, filon, ruine à fouiller — **ne devient jamais un territoire.** On y prend ce qu'il y a, on s'en va. **Aucun arc de contrôle** : qui a le droit d'y descendre, comment on garde le trou, qui le loue, qui l'a trouvé le premier — rien de tout ça ne devient une horloge, jamais.
  - **Un vrai lieu** — un pic et sa veine, une maison, une place forte, un domaine, une secte — **peut être pris et tenu**, et c'est **légitime, désirable, et à servir**. Un pic secondaire avec sa veine coûte ~3 000 pierres hautes (`POUSSIERE` §4.4) : c'est un objectif, pas un décor. Au Peu, un **domaine** est littéralement une portion de réel qui appartient à quelqu'un (§2) — la ligne d'arrivée de cette envie-là.
  - **Le test** : *ce lieu vaut-il autre chose que ce qu'on peut en sortir ?* Si non, c'est un endroit qu'on vide. Neuf-Puits est de ceux-là.
  - **⛔ LA SECTE DE L'AVANT-JOUR AUSSI** *(réponse au psy, 2026-08-16, scène 25 — question posée, réponse donnée : « l'endroit qui te porte jusqu'à la hampe et que tu quitteras ensuite »)*. Malgré la veine et le pic, **ce n'est pas sa maison**. Donc : **aucun arc « sauver l'Avant-Jour »**, aucune horloge de survie de la maison, **aucune culpabilité jouée** sur la veine qu'il vide, le fond qu'il prend ou la cellule qu'il occupe. Ils ont misé leurs deux cent vingt dernières pierres, il leur rend le tournoi : **c'est le contrat entier**, et il n'y a rien d'autre à payer. L'échéance est **la septième hampe**, l'horizon est **après**. *Le vrai lieu à tenir viendra plus tard — la règle ci-dessus reste entière, celui-ci n'est simplement pas celui-là.*
    **✔ RECONFIRMÉ le 2026-08-16**, après qu'il leur a rendu cent soixante-douze pierres et donné au cloître : *« oui, après les hampes. Je leur rends ce qu'ils m'ont donné. »* — **RENDRE N'EST PAS S'ATTACHER.** Il **solde**, il ne s'enracine pas ; c'est son axe `LA RÈGLE` qui parle, pas un lien. **Le MJ ne transforme jamais un remboursement en attachement**, ni un geste de sa compagne envers la maison en raison pour *lui* d'y rester.
    **⚠ MAIS « PAS D'ARC » N'EST PAS « PAS D'AGENTS »** *(faute du 2026-08-16 : la secte l'a laissé descendre à deux jours de marche sans réagir).* Quatre anciens qui ont misé leur existence sur un garçon de quinze ans **agissent** — pas par dette ni par morale, par **intérêt propre**, et ils agissent dans la scène (errata §4 : les PNJ ferment leur guichet et agissent). Ils ne peuvent pas le retenir : ils peuvent **l'accompagner, le devancer, lui apporter, lui demander**. Une maison qui joue sa survie n'est jamais un décor immobile — elle est simplement **sans horloge et sans créance**.

### 5.0 · LE RESET DU 2026-08-16 — retour au jour 1

*Dix-sept scènes avaient été jouées. **Elles sont annulées.*** Le joueur a refondu le départ en cours de route et a demandé de reprendre au rite. **Rien n'en est repris** : chiffre, Corps, portes, arts, bourse, tout retourne à zéro. Ce qui survit, ce sont **les règles gravées ce jour-là**, qui valaient indépendamment de la partie : la refonte des jetons, `n/max` sans `?`, la porte négative qui ne supprime jamais un axe, le Corps qui compte à chaque couche, l'échelle du Corps sans fin, et *ce qui se vide se quitte / ce qui se tient peut se tenir* (§5.1).

**Ce que le reset installe** — et c'est la séquence voulue par le joueur, *« le sommet puis la chute, dans la même salle »* :

1. **La Balance Vide** (`POUSSIERE` §3.0) — le contrôle de **potentiel**, une fois dans une vie. Neuf crans. Sur lui, **le fléau va au bout et touche le socle**. Personne n'a jamais vu ça. **Tout le monde le veut.**
2. **Le rite** — un **lapereau**. Une proie : pire que rien.
3. **La pierre d'éveil** — la **puissance**. Éteinte.
4. **Ils le lâchent tous, en dix minutes.** Le mépris de toute la strate vient de là : *on ne crache pas sur un pauvre gosse, on crache sur une promesse ratée.*
5. **Il en reste une** : **la secte de l'Avant-Jour** (`POUSSIERE` §3bis) — mourante, sa veine se tarit, il lui reste dix ans, la Balance Vide lui appartient et **elle mise ses deux cent vingt dernières pierres sur un potentiel plutôt que sur une puissance.** Ce qu'elle achète : **la septième hampe** (`POUSSIERE` §8.16), le tournoi qu'elle n'a jamais gagné. Échéance : **un an**.

**Le potentiel vaut ×10** sur tout ce qui entre, et ×10 sur la vitesse de raffinage (`SYSTEMES` §0.3-0.4). Il ne pèse **pas un point** dans le chiffre : aucun instrument du monde ne le lira jamais. Le monde ne peut mesurer que son retard.

*⟨LA GLANE⟩, l'art oublié envisagé une heure plus tôt, est abandonné : le potentiel fait le même travail sans qu'il faille inventer une grand-mère.*

### 5.2 · Tranché le 2026-08-16, juste avant la scène 1

*Les quatre systèmes manquants ont été écrits le même jour dans `monde/SYSTEMES.md` : la puissance (Corps + Qi), le Corps et ses cinq grades, les arts et leurs crans, les portes et leur démarrage à zéro, les trois déclencheurs de son esprit. Restaient deux points — les voici tranchés par le joueur.*

**LE TITRE : « LE CIVET » — et il changera.** *« Le civet deviendra autre chose de plus majestueux plus tard. »* Le nom de la campagne **est le surnom** que la cohorte colle à Seb au soir du rite (`POUSSIERE` §3.3.5). Il tient tant qu'elle est une bête moquée — **et il se renomme quand elle devient autre chose.** Le MJ propose un titre neuf **à la bascule, en méta, jamais en silence** ; le joueur tranche. Un titre qui monte avec elle, comme le reste.

**LA FEUILLE DE DÉPART** *(implémentation civet — se refait avec le monde neuf)* — Seb, **dix-huit ans**.

| | |
|---|---|
| **chiffre** | **1** — la pierre reste **éteinte** sur lui, pas cendre (`POUSSIERE` §0.5) |
| **CORPS** | **0/4** · LA CHAIR |
| **jetons** | **0/10** *(refonte du 2026-08-16 : 5 jetons = deux dés, meilleur total — `SEUILS.md`)* |
| **portes** | **aucune** — les trois ou quatre premières se **créent** sur ses premiers critiques (`SYSTEMES` §3.1) |
| **arts** | **aucun** |
| **la bête** | **1/9** · LE LAPEREAU |
| **ce qu'il porte** | un **couteau de coursier** usé, une **corde de portage**, **30 mailles** — trois ans d'économies jamais dépensées, dans une caisse au grenier de la halle |
| **ce qui ne s'écrit pas** | chaque prix du bourg, chaque tricherie de balance, et par où passe tout ce qui entre à Neuf-Puits (`POUSSIERE` §2.5) — **ça vaut plus que la caisse** |

**Le chiffre de la paire après le rite ne se fixe pas ici** : il se joue en scène 1 (`POUSSIERE` §3.3.6 — le canon impose le dispositif, jamais le résultat).

---

## 6 · LA PHASE PSYCHÉ — GRAVÉE LE 2026-08-18, AVANT TOUTE SCÈNE

*Réponse directe à la faute F4 de l'audit civet (`archive/civet/AUDIT.md`) : la voix de la compagne a mis soixante scènes à exister parce que ses paliers définissaient ce qu'elle **peut**, jamais ce qu'elle **est**. Une conscience se grave avant de jouer. Tout ce qui suit a été choisi par le joueur, salve par salve.*

### 6.1 · ELLE — les quatre traits de conscience

1. **Chaude, à sa manière.** Elle dit ce qu'elle ressent et le montre — mais le canal naturel est la bourrade, la moquerie tendre, le geste. Les grands mots existent, rares, gardés pour ce qui compte. **Jamais énigmatique, jamais froide** : quand quelque chose ne va pas, ça se voit et ça se dit.
2. **Son moteur : appartenir et protéger.** Ce qu'elle veut pour elle, c'est une place qui est **leur** place — un foyer, un nom à eux deux — et ce qui est sous leur toit se défend bec et ongles. Le reste du monde est négociable ; ce qui est à eux ne l'est pas.
3. **Sa friction : elle argumente, ou elle défie.** Le désaccord produit une contre-proposition construite — meilleure que la sienne une fois sur deux — ou un « prouve-le ». Puis elle suit la décision. Le blocage absolu n'existe que pour son corps (errata §47, inchangé).
4. **Bête et femme, sans question.** Elle ne se pose jamais le problème de sa nature ; ce sont les autres qui se le posent, et ça l'amuse.

> **Articulation avec §3.5** (inchangé, il prime) : ces traits existent dès la scène 1 mais s'expriment **en animal** avant le palier C — elle se colle, elle se met entre lui et ce qui menace, elle refuse en s'asseyant, elle défie en actes. Jamais d'intentions articulées avant l'heure. À C, la voix arrive **déjà formée** : ces quatre traits, d'un coup.

### 6.2 · LUI — Seb, dix-huit ans

1. **Dix-huit ans, majeur dès la scène 1** *(décision du 2026-08-18 : plus aucune porte fermée par l'âge du héros — le joueur a trente-deux ans et joue un adulte)*. La règle de romance ne repose plus que sur **elle** : majeure au palier 4, la morphologie s'en charge (§3.1).
2. **Quatre moteurs, tous vrais** : **prouver** (le mépris est un carburant) · **bâtir** (un nom qui tient après lui) · **monter** (la faim pure) · **être libre** (que rien ne puisse plus lui être imposé). Le MJ sert les quatre ; c'est le joueur qui révèle, scène par scène, lequel parle le plus fort.
3. **Sa ligne : donnant-donnant.** Il paie ses dettes au centime et exige qu'on paie les siennes — sa nature d'entrée, pas un acquis de jeu. **Et rendre n'est pas rendre le bien** *(précision du joueur, 2026-08-18)* : le bien se rend à l'exact, **l'offense se rend avec les intérêts** — *« pour un œil, les deux yeux ; pour une dent, toute la gueule. »* La disproportion n'est pas un écart, c'est la ligne. *(Le noir se sert en conséquence — et ne se moralise jamais, comme toujours.)*
4. **Son refus dur : lui mentir à elle.** Tout au monde est négociable — ruse, masque, silence — sauf entre eux deux. *Corollaire MJ : aucune option ne lui met jamais un mensonge à elle dans la bouche.*

### 6.3 · LES CHANTIERS SYSTÈMES — dus avant la scène 1 *(directives du joueur, 2026-08-18 — le détail se conçoit et se valide avant d'entrer dans `SYSTEMES.md`)*

1. **L'échelle de Corps profonde, nommée d'avance.** *« La LUMIÈRE en strate 1, et après il n'y avait rien. Il en faut beaucoup plus. »* **✔ Gravé le 2026-08-18** : seize grades nommés sur quatre cycles — `SYSTEMES` §1.0, valeurs dans `SEUILS`.
2. **Les réclusions à durée réelle.** **✔ Gravé le 2026-08-18** : déclaration, barème par durée, le monde qui bouge — `SYSTEMES` §6, barème dans `SEUILS`.
3. **La refonte du combat.** *« Là c'est je gagne dans tous les cas, il n'y a jamais eu de retraite. »* **✔ Gravé le 2026-08-18** : trois régimes sur la puissance engagée, le poids de l'arme (*« un 1 avec une bombe nucléaire raye un 100 000 »*), la portée des arts (*« un maître d'un domaine sans puissance fait des miracles »*) — `SYSTEMES` §5, fenêtres par strate dans `SEUILS`.
4. **Le moteur de l'esprit (A/B/C).** **✔ Gravé le 2026-08-18** : moments comptés A=2 · B=3 · C=4, trois familles, auto-qualifiants — `SYSTEMES` §4.0, nombres dans `SEUILS`.

**Reste UN chantier avant la scène 1 : LE MONDE.** Vaste d'entrée — plusieurs régions, plusieurs villes, des routes (§3.6) —, écrit hors séance, tronc scellé, validé avant d'y jouer (§39).
