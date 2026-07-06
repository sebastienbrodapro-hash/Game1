const STORAGE_KEY = "chronique-incrementale-v1";

// Grille de l'arbre : chaque node occupe une case (c, r).
const TREE_STEP = 134;
const TREE_NODE = 118;
const TREE_PAD = 22;

const resourceMeta = {
  evolution: { label: "Points d'évolution", short: "Évo" },
  survie: { label: "Survie", short: "Sur" },
  nourriture: { label: "Nourriture", short: "Nou" },
  pierre: { label: "Pierre", short: "Pie" },
  savoir: { label: "Savoir", short: "Sav" },
  population: { label: "Population", short: "Pop" },
  influence: { label: "Influence", short: "Inf" },
  artisanat: { label: "Artisanat", short: "Art" },
  idees: { label: "Idées", short: "Idé" },
  energie: { label: "Énergie", short: "Éne" },
  production: { label: "Production", short: "Pro" },
  recherche: { label: "Recherche", short: "Rec" },
  donnees: { label: "Données", short: "Don" },
  calcul: { label: "Calcul", short: "Cal" },
  colonies: { label: "Colonies", short: "Col" },
  conscience: { label: "Conscience", short: "Con" },
  heritage: { label: "Héritage", short: "Hér" }
};

const eraData = [
  {
    id: "prehistoire",
    name: "Préhistoire",
    range: "2,5M - 10 000 av. J.-C.",
    theme: "La tribu apprend à survivre, transmettre et garder le feu.",
    color: "#e0954f",
    actionLabel: "Organiser la tribu",
    actionText: "Gagne de la survie et un peu de nourriture.",
    action: { survie: 1.15, nourriture: 0.15 },
    unlock: null,
    generators: [
      { id: "cueilleurs", name: "Cueilleurs", text: "Ils ramassent ce qui nourrit la tribu.", cost: { survie: 18 }, scale: 1.18, produces: { nourriture: 0.055, survie: 0.0017 }, pos: { c: 0, r: 0 } },
      { id: "ramasseursGalets", name: "Ramasseurs de galets", text: "Ils cherchent les pierres utiles autour du camp.", cost: { survie: 68, nourriture: 18 }, scale: 1.18, produces: { pierre: 0.075 }, requires: ["feu"], parent: "cueilleurs", pos: { c: 1, r: 0 } },
      { id: "tailleursBruts", name: "Tailleurs sans atelier", text: "La pierre devient outil avant même d'avoir un atelier.", cost: { pierre: 72, nourriture: 80 }, scale: 1.2, produces: { pierre: 0.18, savoir: 0.012 }, requires: ["outils"], producerRequires: { ramasseursGalets: 4 }, resourceRequires: { pierre: 80 }, parent: "ramasseursGalets", pos: { c: 1, r: 1 } },
      { id: "tablesTaillage", name: "Tables de taillage", text: "Un poste fixe stabilise le geste et prépare les tailleurs V2.", cost: { pierre: 420, survie: 520 }, scale: 1.28, produces: { pierre: 0.34, savoir: 0.025 }, requires: ["outils"], producerRequires: { tailleursBruts: 8 }, resourceRequires: { pierre: 420 }, parent: "tailleursBruts", pos: { c: 2, r: 1 } },
      { id: "chasseurs", name: "Chasseurs", text: "Ils rapportent des peaux, des outils et de la sécurité.", cost: { nourriture: 90, pierre: 48 }, scale: 1.19, produces: { survie: 0.18 }, requires: ["pistes"], producerRequires: { tailleursBruts: 4 }, parent: "tailleursBruts", pos: { c: 0, r: 2 } },
      { id: "tailleursAtelier", name: "Tailleurs V2", text: "Une table, une séquence, un rendement qui change d'échelle.", cost: { pierre: 760, savoir: 32 }, scale: 1.22, produces: { pierre: 0.7, savoir: 0.09 }, requires: ["pistes"], producerRequires: { tablesTaillage: 1 }, resourceRequires: { pierre: 650 }, parent: "tablesTaillage", pos: { c: 1, r: 2 } },
      { id: "conteurs", name: "Conteurs", text: "Ils gardent les gestes utiles en mémoire.", cost: { survie: 360, nourriture: 180, savoir: 36 }, scale: 1.2, produces: { savoir: 0.08 }, requires: ["signes"], producerRequires: { tailleursAtelier: 4 }, parent: "tailleursAtelier", pos: { c: 2, r: 2 } }
    ],
    nodes: [
      { id: "feu", name: "Feu gardé", tag: "Socle", text: "La nuit devient moins totale. La tribu cesse de seulement subir.", cost: { survie: 42, nourriture: 10, evolution: 28 }, pos: { c: 3, r: 0 }, effects: { click: { survie: 0.8 }, mult: { survie: 0.12 } } },
      { id: "braises", name: "Braises conservées", tag: "Feu", text: "Le feu dure entre deux nuits. Les actions donnent plus d'évolution.", cost: { survie: 120, nourriture: 36, evolution: 58 }, requires: ["feu"], pos: { c: 2, r: 1 }, effects: { click: { evolution: 0.75 }, mult: { evolution: 0.08 } } },
      { id: "outils", name: "Outils taillés", tag: "Technique", text: "Chaque action nourrit mieux la tribu et ouvre la chasse organisée.", cost: { survie: 160, nourriture: 52, pierre: 26, evolution: 64 }, requires: ["feu"], producerRequires: { ramasseursGalets: 3 }, pos: { c: 4, r: 1 }, effects: { click: { nourriture: 0.38 }, mult: { nourriture: 0.16 } } },
      { id: "pistes", name: "Pistes de chasse", tag: "Survie", text: "Lire les traces transforme les chasseurs en moteur de survie.", cost: { survie: 420, nourriture: 170, pierre: 90, evolution: 110 }, requires: ["outils"], producerRequires: { tailleursBruts: 4 }, pos: { c: 2, r: 2 }, effects: { mult: { survie: 0.22 }, generator: { chasseurs: 0.45 } } },
      { id: "abris", name: "Abris saisonniers", tag: "Camp", text: "La nourriture se perd moins et les coûts respirent un peu.", cost: { survie: 520, nourriture: 260, evolution: 130 }, requires: ["braises"], producerRequires: { cueilleurs: 10 }, pos: { c: 4, r: 2 }, effects: { mult: { nourriture: 0.2 }, discount: 0.03 } },
      { id: "signes", name: "Signes gravés", tag: "Mémoire", text: "La tribu laisse des marques. Les premiers savoirs deviennent possibles.", cost: { survie: 900, nourriture: 520, pierre: 180, evolution: 220 }, requires: ["pistes", "abris"], producerRequires: { tablesTaillage: 1 }, pos: { c: 3, r: 3 }, effects: { click: { savoir: 0.08 }, mult: { evolution: 0.12 } } },
      { id: "parole", name: "Parole commune", tag: "Langage", text: "Les ordres, mythes et techniques circulent sans être redécouverts.", cost: { savoir: 18, survie: 1250, evolution: 320 }, requires: ["signes"], pos: { c: 2, r: 4 }, effects: { mult: { savoir: 0.32 }, global: 0.03 } },
      { id: "foyer", name: "Foyer des conteurs", tag: "Savoir", text: "Les conteurs transforment la mémoire en progression durable.", cost: { savoir: 42, nourriture: 900, pierre: 280, evolution: 480 }, requires: ["signes"], producerRequires: { tailleursAtelier: 3 }, pos: { c: 4, r: 4 }, effects: { generator: { conteurs: 0.65 }, click: { savoir: 0.14 } } },
      { id: "rites", name: "Rites de transmission", tag: "Culture", text: "La tribu apprend à reproduire ses propres accélérations.", cost: { savoir: 105, survie: 2400, evolution: 820 }, requires: ["parole", "foyer"], producerRequires: { conteurs: 6 }, pos: { c: 3, r: 5 }, effects: { mult: { evolution: 0.22, savoir: 0.18 }, generator: { cueilleurs: 0.4, chasseurs: 0.7, conteurs: 0.35 }, clickAll: 0.08, global: 0.04 } },
      { id: "tribuStable", name: "Tribu stable", tag: "Unlock", text: "La tribu peut rester, semer et bâtir. Débloque le Néolithique.", cost: { survie: 2200, nourriture: 1500, savoir: 180, evolution: 1200 }, requires: ["rites"], producerRequires: { chasseurs: 10, conteurs: 10 }, pos: { c: 3, r: 6 }, effects: { global: 0.08 } }
    ]
  },
  {
    id: "neolithique",
    name: "Néolithique",
    range: "10 000 - 3 300 av. J.-C.",
    theme: "La survie devient organisation : champs, stockage, villages.",
    color: "#8fbf6f",
    actionLabel: "Planifier les récoltes",
    actionText: "Transforme l'effort en nourriture et en population.",
    action: { nourriture: 2, population: 0.03 },
    unlock: { node: "tribuStable", label: "Acheter Tribu stable" },
    generators: [
      { id: "champs", name: "Champs", text: "Une production lente mais fiable.", cost: { nourriture: 260, savoir: 25 }, scale: 1.18, produces: { nourriture: 1.1 }, pos: { c: 1, r: 0 } },
      { id: "irrigants", name: "Irrigants", text: "Les canaux amènent l'eau jusqu'aux parcelles éloignées.", cost: { nourriture: 1100, savoir: 70, pierre: 120 }, scale: 1.19, produces: { nourriture: 3.4 }, requires: ["irrigation"], producerRequires: { champs: 4 }, parent: "champs", pos: { c: 0, r: 1 } },
      { id: "eleveurs", name: "Éleveurs", text: "Les troupeaux suivent la tribu, puis la tribu suit les troupeaux.", cost: { nourriture: 780, population: 3 }, scale: 1.19, produces: { nourriture: 1.4, population: 0.03 }, requires: ["elevage"], producerRequires: { champs: 2 }, parent: "champs", pos: { c: 1, r: 1 } },
      { id: "greniers", name: "Greniers", text: "Le stockage rend les famines moins brutales.", cost: { nourriture: 650, population: 2 }, scale: 1.19, produces: { population: 0.08 }, requires: ["stockage"], parent: "champs", pos: { c: 2, r: 1 } },
      { id: "batisseurs", name: "Bâtisseurs", text: "Ils dressent des pierres que le temps n'osera pas coucher.", cost: { pierre: 480, population: 10, savoir: 160 }, scale: 1.22, produces: { pierre: 1.6, savoir: 0.35 }, requires: ["megalithes"], producerRequires: { greniers: 5 }, parent: "greniers", pos: { c: 1, r: 2 } },
      { id: "potiers", name: "Potiers", text: "Les objets standards font circuler les méthodes.", cost: { savoir: 80, population: 4 }, scale: 1.2, produces: { savoir: 0.42, artisanat: 0.22 }, requires: ["poterie"], producerRequires: { greniers: 3 }, parent: "greniers", pos: { c: 2, r: 2 } },
      { id: "tisserands", name: "Tisserands", text: "La laine et le lin habillent le village entier.", cost: { artisanat: 45, nourriture: 2400, population: 8 }, scale: 1.2, produces: { artisanat: 0.7, population: 0.05 }, requires: ["tissage"], producerRequires: { potiers: 4 }, parent: "potiers", pos: { c: 2, r: 3 } }
    ],
    nodes: [
      { id: "agriculture", name: "Agriculture", tag: "Production", text: "La nourriture gagne un multiplicateur massif.", cost: { nourriture: 520, savoir: 60 }, pos: { c: 3, r: 0 }, effects: { mult: { nourriture: 0.55 } } },
      { id: "elevage", name: "Élevage", tag: "Troupeaux", text: "Les bêtes domestiquées nourrissent et peuplent le village.", cost: { nourriture: 950, savoir: 95 }, requires: ["agriculture"], pos: { c: 2, r: 1 }, effects: { mult: { nourriture: 0.25, population: 0.2 }, click: { population: 0.05 } } },
      { id: "irrigation", name: "Irrigation", tag: "Eau", text: "Les canaux libèrent les champs du caprice des pluies.", cost: { nourriture: 1700, pierre: 150, savoir: 130 }, requires: ["agriculture"], pos: { c: 4, r: 1 }, effects: { mult: { nourriture: 0.4 }, generator: { champs: 0.5 } } },
      { id: "stockage", name: "Stockage", tag: "Qualité", text: "Les coûts des producteurs baissent légèrement.", cost: { nourriture: 1300, savoir: 110 }, requires: ["elevage"], pos: { c: 2, r: 2 }, effects: { discount: 0.06, mult: { population: 0.18 } } },
      { id: "calendrier", name: "Calendrier", tag: "Ciel", text: "Compter les lunes, prévoir les semailles, mesurer le temps.", cost: { savoir: 320, nourriture: 2200 }, requires: ["irrigation"], pos: { c: 4, r: 2 }, effects: { mult: { savoir: 0.45 }, click: { savoir: 0.12 } } },
      { id: "poterie", name: "Poterie", tag: "Artisanat", text: "L'argile cuite conserve le grain, l'huile et les idées de forme.", cost: { savoir: 240, nourriture: 2600, population: 10 }, requires: ["stockage"], pos: { c: 1, r: 3 }, effects: { click: { artisanat: 0.15 }, mult: { savoir: 0.2 }, generator: { potiers: 0.4 } } },
      { id: "villages", name: "Villages", tag: "Société", text: "La population amplifie tout ce que la tribu produit.", cost: { population: 18, savoir: 120 }, requires: ["stockage"], pos: { c: 3, r: 3 }, effects: { global: 0.12 } },
      { id: "tissage", name: "Tissage", tag: "Artisanat", text: "Des fibres croisées naissent les étoffes et le commerce à venir.", cost: { artisanat: 70, savoir: 420 }, requires: ["poterie"], pos: { c: 1, r: 4 }, effects: { mult: { artisanat: 0.5, population: 0.15 } } },
      { id: "troc", name: "Troc organisé", tag: "Échange", text: "Les surplus circulent entre villages et chacun s'enrichit.", cost: { artisanat: 140, nourriture: 5200, population: 26 }, requires: ["villages"], pos: { c: 3, r: 4 }, effects: { discount: 0.05, mult: { artisanat: 0.3 }, global: 0.05 } },
      { id: "megalithes", name: "Mégalithes", tag: "Monument", text: "Des pierres levées alignées sur le ciel unissent les clans.", cost: { pierre: 950, population: 30, savoir: 380 }, requires: ["villages", "calendrier"], pos: { c: 4, r: 4 }, effects: { mult: { savoir: 0.35, pierre: 0.4 }, generator: { batisseurs: 0.5 }, global: 0.06 } },
      { id: "ecriture", name: "Écriture primitive", tag: "Unlock", text: "Les comptes, dettes et récits deviennent persistants. Débloque l'Antiquité.", cost: { savoir: 900, population: 42, nourriture: 9000, artisanat: 300 }, requires: ["troc", "megalithes"], pos: { c: 3, r: 5 }, effects: { mult: { savoir: 0.35 }, global: 0.08 } }
    ]
  },
  {
    id: "antiquite",
    name: "Antiquité",
    range: "3 300 av. J.-C. - 476",
    theme: "Le savoir devient pouvoir : routes, commerce, cités et empires.",
    color: "#dfaf54",
    actionLabel: "Administrer la cité",
    actionText: "Crée influence, savoir et commerce.",
    action: { influence: 1, savoir: 0.35 },
    unlock: { node: "ecriture", label: "Acheter Écriture primitive" },
    generators: [
      { id: "scribes", name: "Scribes", text: "Ils transforment les ressources en savoir durable.", cost: { savoir: 460, population: 28 }, scale: 1.18, produces: { savoir: 2.1, influence: 0.22 }, pos: { c: 1, r: 0 } },
      { id: "marchands", name: "Marchands", text: "Les routes font circuler influence et richesse.", cost: { influence: 120, nourriture: 4200 }, scale: 1.19, produces: { influence: 1.4 }, requires: ["monnaie"], producerRequires: { scribes: 3 }, parent: "scribes", pos: { c: 0, r: 1 } },
      { id: "philosophes", name: "Philosophes", text: "Ils questionnent le monde jusqu'à ce qu'il réponde.", cost: { savoir: 2400, influence: 900 }, scale: 1.2, produces: { savoir: 6.5, influence: 0.5 }, requires: ["academie"], producerRequires: { scribes: 6 }, parent: "scribes", pos: { c: 2, r: 1 } },
      { id: "legionnaires", name: "Légionnaires", text: "L'empire avance au rythme de leurs sandales.", cost: { influence: 1600, nourriture: 16000 }, scale: 1.21, produces: { influence: 3.6 }, requires: ["legions"], producerRequires: { marchands: 5 }, parent: "marchands", pos: { c: 0, r: 2 } },
      { id: "architectes", name: "Architectes", text: "Les monuments organisent l'espace et la mémoire.", cost: { influence: 620, savoir: 900 }, scale: 1.21, produces: { artisanat: 0.75, pierre: 1.2 }, requires: ["fer"], producerRequires: { marchands: 3 }, parent: "marchands", pos: { c: 1, r: 2 } },
      { id: "forgerons", name: "Forgerons", text: "Le fer plie, la cité s'équipe, l'artisanat s'envole.", cost: { artisanat: 380, pierre: 1400, influence: 2200 }, scale: 1.21, produces: { artisanat: 2.2, pierre: 2.5 }, requires: ["fer"], producerRequires: { architectes: 3 }, parent: "architectes", pos: { c: 1, r: 3 } }
    ],
    nodes: [
      { id: "lois", name: "Codes de lois", tag: "Ordre", text: "Les ressources sociales produisent mieux ensemble.", cost: { influence: 300, savoir: 700 }, pos: { c: 3, r: 0 }, effects: { mult: { influence: 0.45 }, global: 0.05 } },
      { id: "monnaie", name: "Monnaie frappée", tag: "Économie", text: "Une valeur commune fluidifie tous les échanges.", cost: { influence: 750, savoir: 1100 }, requires: ["lois"], pos: { c: 2, r: 1 }, effects: { discount: 0.05, mult: { influence: 0.3 }, click: { influence: 0.4 } } },
      { id: "academie", name: "Académies", tag: "Savoir", text: "Le savoir gagne un rôle central dans la suite.", cost: { savoir: 2600, influence: 1800 }, requires: ["lois"], pos: { c: 4, r: 1 }, effects: { mult: { savoir: 0.8 }, click: { savoir: 1.5 } } },
      { id: "routes", name: "Routes impériales", tag: "Réseau", text: "Les producteurs d'influence deviennent beaucoup plus efficaces.", cost: { influence: 1200, artisanat: 110 }, requires: ["monnaie"], pos: { c: 2, r: 2 }, effects: { generator: { marchands: 0.85 }, mult: { influence: 0.25 } } },
      { id: "bibliotheque", name: "Grandes bibliothèques", tag: "Mémoire", text: "Chaque rouleau copié épargne une redécouverte.", cost: { savoir: 6800, influence: 3200 }, requires: ["academie"], pos: { c: 4, r: 2 }, effects: { mult: { savoir: 0.6 }, generator: { philosophes: 0.5, scribes: 0.35 } } },
      { id: "fer", name: "Âge du fer", tag: "Métal", text: "Outils, armes et charrues changent de matière.", cost: { artisanat: 260, influence: 2600, pierre: 800 }, requires: ["routes"], pos: { c: 3, r: 3 }, effects: { mult: { artisanat: 0.55 }, generator: { forgerons: 0.4 }, click: { artisanat: 0.3 } } },
      { id: "theatre", name: "Théâtres", tag: "Culture", text: "La cité se raconte elle-même et s'en trouve grandie.", cost: { savoir: 5200, influence: 4200, artisanat: 380 }, requires: ["bibliotheque"], pos: { c: 5, r: 3 }, effects: { clickAll: 0.1, mult: { influence: 0.25, savoir: 0.25 } } },
      { id: "legions", name: "Légions", tag: "Empire", text: "Les frontières deviennent des routes sûres.", cost: { influence: 5200, nourriture: 26000, artisanat: 450 }, requires: ["fer"], pos: { c: 2, r: 4 }, effects: { mult: { influence: 0.45 }, generator: { legionnaires: 0.5 } } },
      { id: "aqueducs", name: "Aqueducs", tag: "Génie", text: "L'eau courante multiplie la ville.", cost: { pierre: 2600, influence: 6200, savoir: 7500 }, requires: ["fer"], pos: { c: 4, r: 4 }, effects: { mult: { population: 0.6 }, global: 0.08 } },
      { id: "forum", name: "Forum", tag: "Cité", text: "Commerce, justice et rumeurs au même endroit : tout accélère.", cost: { influence: 9500, artisanat: 850, savoir: 9800 }, requires: ["legions", "aqueducs"], pos: { c: 3, r: 5 }, effects: { global: 0.1, mult: { influence: 0.4 }, clickAll: 0.08 } },
      { id: "chartes", name: "Chartes urbaines", tag: "Unlock", text: "Les villes peuvent s'autogouverner. Débloque le Moyen Âge.", cost: { influence: 16000, artisanat: 1400, savoir: 15000 }, requires: ["forum"], pos: { c: 3, r: 6 }, effects: { global: 0.16 } }
    ]
  },
  {
    id: "moyenage",
    name: "Moyen Âge",
    range: "476 - 1450",
    theme: "Guildes, foi, forteresses et transmission lente.",
    color: "#8aa3d6",
    actionLabel: "Organiser une guilde",
    actionText: "Produit artisanat et influence.",
    action: { artisanat: 2, influence: 0.5 },
    unlock: { node: "chartes", label: "Acheter Chartes urbaines" },
    generators: [
      { id: "guildes", name: "Guildes", text: "Elles rendent les métiers reproductibles.", cost: { artisanat: 580, influence: 2200 }, scale: 1.2, produces: { artisanat: 3.4 }, pos: { c: 0, r: 0 } },
      { id: "scriptoriums", name: "Scriptoriums", text: "Ils copient lentement le savoir.", cost: { savoir: 6200, artisanat: 900 }, scale: 1.22, produces: { savoir: 5.5 }, pos: { c: 1, r: 0 } },
      { id: "foires", name: "Foires", text: "Le commerce revient par cycles.", cost: { influence: 9600, population: 72 }, scale: 1.21, produces: { influence: 6.2 }, pos: { c: 2, r: 0 } }
    ],
    nodes: [
      { id: "moulins", name: "Moulins", tag: "Mécanique", text: "Une première automatisation diffuse.", cost: { artisanat: 1800, savoir: 8600 }, pos: { c: 3, r: 0 }, effects: { global: 0.14, mult: { artisanat: 0.35 } } },
      { id: "universites", name: "Universités", tag: "Savoir", text: "Les savoirs se contredisent puis s'affinent.", cost: { savoir: 16000, influence: 12000 }, requires: ["moulins"], pos: { c: 2, r: 1 }, effects: { mult: { savoir: 0.7 }, click: { savoir: 3 } } },
      { id: "banques", name: "Banques marchandes", tag: "Système", text: "Les prix de long terme deviennent plus faciles à absorber.", cost: { influence: 26000, artisanat: 5200 }, requires: ["moulins"], pos: { c: 4, r: 1 }, effects: { discount: 0.08, mult: { influence: 0.35 } } },
      { id: "imprimerie", name: "Imprimerie", tag: "Unlock", text: "Les idées peuvent enfin se multiplier. Débloque la Renaissance.", cost: { savoir: 64000, artisanat: 14000, influence: 42000 }, requires: ["universites", "banques"], pos: { c: 3, r: 2 }, effects: { global: 0.18, click: { idees: 1 } } }
    ]
  },
  {
    id: "renaissance",
    name: "Renaissance",
    range: "1450 - 1760",
    theme: "Exploration, expérimentation, imprimerie et méthode scientifique.",
    color: "#b48fd9",
    actionLabel: "Mener une expérience",
    actionText: "Produit des idées et de la recherche.",
    action: { idees: 2.2, recherche: 0.15 },
    unlock: { node: "imprimerie", label: "Acheter Imprimerie" },
    generators: [
      { id: "ateliers", name: "Ateliers savants", text: "Ils transforment artisanat en idées.", cost: { idees: 500, artisanat: 24000 }, scale: 1.19, produces: { idees: 3.5 }, pos: { c: 0, r: 0 } },
      { id: "cartographes", name: "Cartographes", text: "Ils ouvrent les réseaux et les risques.", cost: { idees: 1800, influence: 90000 }, scale: 1.21, produces: { influence: 18, recherche: 0.65 }, pos: { c: 1, r: 0 } },
      { id: "laboratoires", name: "Laboratoires", text: "La recherche devient une ressource autonome.", cost: { recherche: 120, savoir: 140000 }, scale: 1.22, produces: { recherche: 1.8 }, pos: { c: 2, r: 0 } }
    ],
    nodes: [
      { id: "methode", name: "Méthode scientifique", tag: "Règle", text: "La recherche multiplie toutes les ressources anciennes.", cost: { recherche: 420, idees: 5200 }, pos: { c: 3, r: 0 }, effects: { global: 0.22, mult: { recherche: 0.55 } } },
      { id: "navigation", name: "Navigation globale", tag: "Réseau", text: "Influence et idées s'entrelacent.", cost: { idees: 14000, influence: 260000 }, requires: ["methode"], pos: { c: 2, r: 1 }, effects: { mult: { influence: 0.55, idees: 0.45 } } },
      { id: "manufactures", name: "Manufactures", tag: "Transition", text: "Les ateliers préparent le choc industriel.", cost: { artisanat: 90000, recherche: 2200 }, requires: ["methode"], pos: { c: 4, r: 1 }, effects: { click: { production: 1 }, mult: { artisanat: 0.5 } } },
      { id: "vapeur", name: "Vapeur contrôlée", tag: "Unlock", text: "La puissance mécanique sort des ateliers. Débloque l'Industrie.", cost: { recherche: 6200, production: 1600, idees: 45000 }, requires: ["navigation", "manufactures"], pos: { c: 3, r: 2 }, effects: { global: 0.24 } }
    ]
  },
  {
    id: "industrie",
    name: "Révolution industrielle",
    range: "1760 - 1914",
    theme: "Machines, charbon, usines, vitesse et coût social.",
    color: "#d97e55",
    actionLabel: "Lancer les machines",
    actionText: "Produit énergie et production.",
    action: { energie: 2, production: 3 },
    unlock: { node: "vapeur", label: "Acheter Vapeur contrôlée" },
    generators: [
      { id: "mines", name: "Mines", text: "L'énergie devient massive.", cost: { energie: 600, production: 1800 }, scale: 1.2, produces: { energie: 8 }, pos: { c: 0, r: 0 } },
      { id: "usines", name: "Usines", text: "La production change d'échelle.", cost: { production: 6500, energie: 2100 }, scale: 1.21, produces: { production: 18 }, pos: { c: 1, r: 0 } },
      { id: "cheminsFer", name: "Chemins de fer", text: "Les ressources circulent à l'échelle du continent.", cost: { production: 34000, influence: 800000 }, scale: 1.22, produces: { influence: 80, production: 12 }, pos: { c: 2, r: 0 } }
    ],
    nodes: [
      { id: "standardisation", name: "Standardisation", tag: "Échelle", text: "La production devient répétable.", cost: { production: 18000, energie: 8000 }, pos: { c: 3, r: 0 }, effects: { mult: { production: 0.8 }, global: 0.08 } },
      { id: "electricite", name: "Électricité", tag: "Énergie", text: "Une nouvelle infrastructure arrive.", cost: { energie: 52000, recherche: 16000 }, requires: ["standardisation"], pos: { c: 3, r: 1 }, effects: { click: { recherche: 4 }, mult: { energie: 0.45 } } },
      { id: "laboratoirePublic", name: "Laboratoires publics", tag: "Recherche", text: "La recherche se met à l'échelle des nations.", cost: { recherche: 52000, production: 220000 }, requires: ["electricite"], pos: { c: 3, r: 2 }, effects: { mult: { recherche: 0.9 }, global: 0.16 } },
      { id: "reseauElectrique", name: "Réseau électrique", tag: "Unlock", text: "La modernité commence. Débloque l'Ère moderne.", cost: { energie: 240000, production: 620000, recherche: 120000 }, requires: ["laboratoirePublic"], pos: { c: 3, r: 3 }, effects: { global: 0.26 } }
    ]
  },
  {
    id: "moderne",
    name: "Ère moderne",
    range: "1914 - 1970",
    theme: "Électricité, médecine, organisation globale et science rapide.",
    color: "#63bfae",
    actionLabel: "Coordonner les laboratoires",
    actionText: "Produit recherche et énergie.",
    action: { recherche: 8, energie: 4 },
    unlock: { node: "reseauElectrique", label: "Acheter Réseau électrique" },
    generators: [
      { id: "centrales", name: "Centrales", text: "L'énergie devient systémique.", cost: { energie: 380000, production: 700000 }, scale: 1.2, produces: { energie: 85 }, pos: { c: 0, r: 0 } },
      { id: "universitesModernes", name: "Universités modernes", text: "La recherche forme ses propres producteurs.", cost: { recherche: 180000, influence: 1800000 }, scale: 1.21, produces: { recherche: 42 }, pos: { c: 1, r: 0 } }
    ],
    nodes: [
      { id: "medecine", name: "Médecine de masse", tag: "Population", text: "La population soutient mieux la progression.", cost: { recherche: 420000, population: 240 }, pos: { c: 3, r: 0 }, effects: { mult: { population: 1.1 }, global: 0.12 } },
      { id: "transistor", name: "Transistor", tag: "Unlock", text: "La miniaturisation ouvre l'Ère numérique.", cost: { recherche: 1400000, energie: 900000 }, requires: ["medecine"], pos: { c: 3, r: 1 }, effects: { click: { donnees: 1 }, global: 0.22 } }
    ]
  },
  {
    id: "numerique",
    name: "Ère numérique",
    range: "1970 - 2050",
    theme: "Données, calcul, réseaux et automatisation.",
    color: "#58c6dd",
    actionLabel: "Compiler les données",
    actionText: "Produit données et calcul.",
    action: { donnees: 5, calcul: 1 },
    unlock: { node: "transistor", label: "Acheter Transistor" },
    generators: [
      { id: "serveurs", name: "Serveurs", text: "Les données deviennent une mine.", cost: { donnees: 600, energie: 1600000 }, scale: 1.2, produces: { donnees: 22 }, pos: { c: 0, r: 0 } },
      { id: "algorithmes", name: "Algorithmes", text: "Le calcul optimise les anciennes chaînes.", cost: { calcul: 180, donnees: 2400 }, scale: 1.22, produces: { calcul: 4.4 }, pos: { c: 1, r: 0 } }
    ],
    nodes: [
      { id: "internet", name: "Internet", tag: "Réseau", text: "Les savoirs deviennent immédiats.", cost: { donnees: 8500, calcul: 900 }, pos: { c: 3, r: 0 }, effects: { global: 0.25, mult: { donnees: 0.8 } } },
      { id: "orbite", name: "Infrastructure orbitale", tag: "Unlock", text: "La civilisation sort de son berceau.", cost: { calcul: 5400, energie: 4500000, recherche: 2200000 }, requires: ["internet"], pos: { c: 3, r: 1 }, effects: { click: { colonies: 0.15 }, global: 0.22 } }
    ]
  },
  {
    id: "spatial",
    name: "Ère spatiale",
    range: "2050 - ?",
    theme: "Orbite, colonies, énergie solaire et autonomie hors Terre.",
    color: "#8b96f8",
    actionLabel: "Lancer une mission",
    actionText: "Produit colonies et énergie.",
    action: { colonies: 0.25, energie: 40 },
    unlock: { node: "orbite", label: "Acheter Infrastructure orbitale" },
    generators: [
      { id: "habitats", name: "Habitats orbitaux", text: "La population devient extraplanétaire.", cost: { colonies: 12, energie: 8000000 }, scale: 1.2, produces: { colonies: 0.8 }, pos: { c: 0, r: 0 } },
      { id: "miroirsSolaires", name: "Miroirs solaires", text: "L'énergie spatiale change l'échelle.", cost: { colonies: 34, calcul: 16000 }, scale: 1.22, produces: { energie: 600 }, pos: { c: 1, r: 0 } }
    ],
    nodes: [
      { id: "biospheres", name: "Biosphères fermées", tag: "Autonomie", text: "Les colonies produisent sans la Terre.", cost: { colonies: 80, recherche: 6200000 }, pos: { c: 3, r: 0 }, effects: { mult: { colonies: 1.1 }, global: 0.14 } },
      { id: "iaGenerale", name: "IA générale", tag: "Unlock", text: "La civilisation pense avec ses propres outils.", cost: { calcul: 50000, donnees: 120000, colonies: 220 }, requires: ["biospheres"], pos: { c: 3, r: 1 }, effects: { click: { conscience: 0.08 }, global: 0.3 } }
    ]
  },
  {
    id: "futur",
    name: "Futur lointain",
    range: "Après la singularité",
    theme: "Conscience collective, IA, post-humanité et héritage cosmique.",
    color: "#d783c8",
    actionLabel: "Synthétiser la conscience",
    actionText: "Produit conscience et héritage potentiel.",
    action: { conscience: 0.2 },
    unlock: { node: "iaGenerale", label: "Acheter IA générale" },
    generators: [
      { id: "espritsDistribues", name: "Esprits distribués", text: "La conscience devient infrastructure.", cost: { conscience: 12, calcul: 120000 }, scale: 1.22, produces: { conscience: 0.65 }, pos: { c: 0, r: 0 } }
    ],
    nodes: [
      { id: "singularite", name: "Singularité maîtrisée", tag: "Final", text: "La civilisation devient capable de se transmettre hors du temps.", cost: { conscience: 80, colonies: 900 }, pos: { c: 3, r: 0 }, effects: { global: 0.5, mult: { conscience: 1.5 } } }
    ]
  }
];

const challengeData = [
  { id: "grandeSecheresse", era: "neolithique", name: "Grande sécheresse", text: "Les pluies manquent des années durant. Nourriture -75 %. Gagner 40 Population.", goal: { resource: "population", amount: 40 }, requires: ["irrigation"], modifiers: { resource: { nourriture: 0.25 } }, reward: { mult: { nourriture: 0.5, population: 0.3 } }, pos: { c: 5, r: 2 } },
  { id: "hiverVolcanique", era: "neolithique", name: "Hiver volcanique", text: "Un volcan voile le soleil plusieurs saisons. Production passive -60 %, clics +25 %. Gagner 9 000 Nourriture.", goal: { resource: "nourriture", amount: 9000 }, requires: ["stockage"], modifiers: { passive: 0.4, click: 1.25 }, reward: { global: 0.1, discount: 0.03 }, pos: { c: 1, r: 2 } },
  { id: "guerresPuniques", era: "antiquite", name: "Guerres puniques", text: "Les routes commerciales s'effondrent. Influence passive -80 %. Gagner 1 600 Influence.", goal: { resource: "influence", amount: 1600 }, requires: ["lois"], modifiers: { resource: { influence: 0.2 } }, reward: { mult: { influence: 0.55 } }, pos: { c: 1, r: 0 } },
  { id: "criseRepublique", era: "antiquite", name: "Crise de la République", text: "Les décisions se figent. Clic divisé par deux, mais le passif tient. Gagner 5 000 Savoir.", goal: { resource: "savoir", amount: 5000 }, requires: ["academie"], modifiers: { click: 0.5 }, reward: { mult: { savoir: 0.65 }, global: 0.05 }, pos: { c: 5, r: 2 } },
  { id: "pesteNoire", era: "moyenage", name: "Peste noire", text: "Les réseaux humains ralentissent. Production globale -60 %. Gagner 18 000 Artisanat.", goal: { resource: "artisanat", amount: 18000 }, requires: ["moulins"], modifiers: { passive: 0.4, click: 0.75 }, reward: { global: 0.12 }, pos: { c: 1, r: 1 } },
  { id: "guerreCentAns", era: "moyenage", name: "Guerre de Cent Ans", text: "Les foires et guildes subissent la guerre. Influence -70 %. Gagner 42 000 Influence.", goal: { resource: "influence", amount: 42000 }, requires: ["banques"], modifiers: { resource: { influence: 0.3 }, cost: 1.25 }, reward: { mult: { artisanat: 0.45, influence: 0.35 } }, pos: { c: 5, r: 2 } },
  { id: "procesGalilee", era: "renaissance", name: "Procès de Galilée", text: "Les idées nouvelles sont freinées. Idées -45 % et coûts plus hauts. Gagner 1 800 Recherche.", goal: { resource: "recherche", amount: 1800 }, requires: ["methode"], modifiers: { cost: 1.55, resource: { idees: 0.55 } }, reward: { mult: { recherche: 0.7, idees: 0.4 } }, pos: { c: 1, r: 0 } },
  { id: "longitudesPerdues", era: "renaissance", name: "Longitudes perdues", text: "La navigation manque de précision. Influence -60 %. Gagner 16 000 Idées.", goal: { resource: "idees", amount: 16000 }, requires: ["navigation"], modifiers: { resource: { influence: 0.4 } }, reward: { mult: { influence: 0.45, idees: 0.35 } }, pos: { c: 1, r: 2 } },
  { id: "smogLondres", era: "industrie", name: "Grand smog industriel", text: "Énergie -70 %, production intacte. Gagner 120 000 Production.", goal: { resource: "production", amount: 120000 }, requires: ["standardisation"], modifiers: { resource: { energie: 0.3 } }, reward: { mult: { production: 0.75 }, global: 0.06 }, pos: { c: 1, r: 1 } },
  { id: "criseCharbon", era: "industrie", name: "Crise du charbon", text: "L'énergie coûte cher. Coûts +60 % et énergie -50 %. Gagner 90 000 Énergie.", goal: { resource: "energie", amount: 90000 }, requires: ["electricite"], modifiers: { cost: 1.6, resource: { energie: 0.5 } }, reward: { mult: { energie: 0.75 }, discount: 0.04 }, pos: { c: 5, r: 2 } },
  { id: "blackout1977", era: "moderne", name: "Blackout de 1977", text: "Passif -50 % et énergie -80 %. Gagner 220 000 Recherche.", goal: { resource: "recherche", amount: 220000 }, requires: ["medecine"], modifiers: { passive: 0.5, resource: { energie: 0.2 } }, reward: { mult: { energie: 0.9, recherche: 0.35 } }, pos: { c: 1, r: 1 } },
  { id: "courseAtomique", era: "moderne", name: "Course atomique", text: "La recherche avance sous contrainte. Coûts +50 %, mais clic recherche +25 %. Gagner 900 000 Recherche.", goal: { resource: "recherche", amount: 900000 }, requires: ["transistor"], modifiers: { cost: 1.5, click: 1.25 }, reward: { mult: { recherche: 0.8 }, global: 0.06 }, pos: { c: 5, r: 2 } },
  { id: "bugAn2000", era: "numerique", name: "Bug de l'an 2000", text: "Données -65 %. Gagner 12 000 Calcul.", goal: { resource: "calcul", amount: 12000 }, requires: ["internet"], modifiers: { resource: { donnees: 0.35 } }, reward: { mult: { donnees: 0.9, calcul: 0.65 } }, pos: { c: 1, r: 1 } },
  { id: "tempeteSolaire", era: "spatial", name: "Tempête solaire", text: "La Terre n'aide presque plus. Gagner 120 Colonies.", goal: { resource: "colonies", amount: 120 }, requires: ["biospheres"], modifiers: { passive: 0.35, click: 1.25 }, reward: { mult: { colonies: 1.1 }, global: 0.08 }, pos: { c: 1, r: 1 } }
];

const eraPacing = {
  prehistoire: {
    actionEvolution: 1.45,
    passiveEvolution: 0.05,
    producerEvolutionCost: 0.8,
    nodeEvolutionCost: 1.1,
    challengeEvolutionCost: 2.8
  },
  neolithique: {
    actionEvolution: 1.2,
    passiveEvolution: 0.07,
    producerEvolutionCost: 0.9,
    nodeEvolutionCost: 1,
    challengeEvolutionCost: 2.2
  },
  antiquite: {
    actionEvolution: 1.1,
    passiveEvolution: 0.075,
    producerEvolutionCost: 0.95,
    nodeEvolutionCost: 1,
    challengeEvolutionCost: 2
  }
};

const milestoneData = [
  { id: "m1", era: "prehistoire", name: "Premier camp", text: "Atteindre 100 Points d'évolution.", condition: (s) => s.resources.evolution >= 100, reward: { click: { evolution: 1, survie: 1 } } },
  { id: "m2", era: "prehistoire", name: "Feu partagé", text: "Acheter Feu gardé.", condition: () => hasNode("feu"), reward: { mult: { savoir: 0.25 } } },
  { id: "m3", era: "prehistoire", name: "Mémoire orale", text: "Avoir 3 jalons de Préhistoire.", condition: () => eraNodeCount("prehistoire") >= 3, reward: { global: 0.06 } },
  { id: "m25", era: "prehistoire", name: "Cueillette organisée", text: "Posséder 5 Cueilleurs.", condition: () => (state.producers.cueilleurs || 0) >= 5, reward: { mult: { nourriture: 0.18 } } },
  { id: "m26", era: "prehistoire", name: "Pistes de chasse", text: "Posséder 5 Chasseurs.", condition: () => (state.producers.chasseurs || 0) >= 5, reward: { mult: { survie: 0.18 } } },
  { id: "m27", era: "prehistoire", name: "Récits du foyer", text: "Posséder 5 Conteurs.", condition: () => (state.producers.conteurs || 0) >= 5, reward: { mult: { savoir: 0.22 } } },
  { id: "m28", era: "prehistoire", name: "Chemins connus", text: "Avoir 6 jalons de Préhistoire.", condition: () => eraNodeCount("prehistoire") >= 6, reward: { global: 0.08, clickAll: 0.12 } },
  { id: "m29", era: "prehistoire", name: "Camp nourri", text: "Posséder 10 Cueilleurs.", condition: () => (state.producers.cueilleurs || 0) >= 10, reward: { click: { nourriture: 0.5 }, mult: { nourriture: 0.3 } } },
  { id: "m30", era: "prehistoire", name: "Chasse rythmée", text: "Posséder 10 Chasseurs.", condition: () => (state.producers.chasseurs || 0) >= 10, reward: { click: { survie: 1.2 }, mult: { survie: 0.32 } } },
  { id: "m31", era: "prehistoire", name: "Mythes communs", text: "Avoir 8 jalons de Préhistoire.", condition: () => eraNodeCount("prehistoire") >= 8, reward: { global: 0.08, mult: { evolution: 0.18 } } },
  { id: "m32", era: "prehistoire", name: "Mémoire vivante", text: "Atteindre 150 Savoir.", condition: (s) => s.resources.savoir >= 150, reward: { click: { savoir: 0.18 }, mult: { savoir: 0.35 } } },
  { id: "m4", era: "neolithique", name: "Premiers champs", text: "Débloquer le Néolithique.", condition: () => isEraUnlocked("neolithique"), reward: { click: { nourriture: 1 } } },
  { id: "m5", era: "neolithique", name: "Village vivant", text: "Atteindre 20 Population.", condition: (s) => s.resources.population >= 20, reward: { mult: { population: 0.3 } } },
  { id: "m6", era: "neolithique", name: "Greniers pleins", text: "Posséder 10 producteurs néolithiques.", condition: () => eraProducerCount("neolithique") >= 10, reward: { discount: 0.03 } },
  { id: "m33", era: "neolithique", name: "Terres nourricières", text: "Posséder 10 Champs.", condition: () => (state.producers.champs || 0) >= 10, reward: { mult: { nourriture: 0.25 } } },
  { id: "m34", era: "neolithique", name: "Fours à poterie", text: "Posséder 5 Potiers.", condition: () => (state.producers.potiers || 0) >= 5, reward: { mult: { artisanat: 0.3 } } },
  { id: "m35", era: "neolithique", name: "Toits du village", text: "Avoir 8 jalons du Néolithique.", condition: () => eraNodeCount("neolithique") >= 8, reward: { global: 0.08, clickAll: 0.1 } },
  { id: "m7", era: "antiquite", name: "Cité écrite", text: "Débloquer l'Antiquité.", condition: () => isEraUnlocked("antiquite"), reward: { click: { influence: 1 } } },
  { id: "m8", era: "antiquite", name: "Routes actives", text: "Acheter Routes impériales.", condition: () => hasNode("routes"), reward: { mult: { influence: 0.3 } } },
  { id: "m9", era: "antiquite", name: "Deux défis vaincus", text: "Compléter 2 challenges.", condition: (s) => s.completedChallenges.length >= 2, reward: { global: 0.1 } },
  { id: "m36", era: "antiquite", name: "École de pensée", text: "Posséder 5 Philosophes.", condition: () => (state.producers.philosophes || 0) >= 5, reward: { mult: { savoir: 0.3 } } },
  { id: "m37", era: "antiquite", name: "Forge et marbre", text: "Avoir 8 jalons de l'Antiquité.", condition: () => eraNodeCount("antiquite") >= 8, reward: { global: 0.08, discount: 0.02 } },
  { id: "m10", era: "moyenage", name: "Villes libres", text: "Débloquer le Moyen Âge.", condition: () => isEraUnlocked("moyenage"), reward: { mult: { artisanat: 0.45 } } },
  { id: "m11", era: "moyenage", name: "Savoirs copiés", text: "Atteindre 100 000 Savoir.", condition: (s) => s.resources.savoir >= 100000, reward: { mult: { savoir: 0.35 } } },
  { id: "m12", era: "renaissance", name: "Idées imprimées", text: "Débloquer la Renaissance.", condition: () => isEraUnlocked("renaissance"), reward: { click: { idees: 2 }, mult: { idees: 0.35 } } },
  { id: "m13", era: "renaissance", name: "Méthode robuste", text: "Acheter Méthode scientifique.", condition: () => hasNode("methode"), reward: { mult: { recherche: 0.35 } } },
  { id: "m14", era: "industrie", name: "Usines en marche", text: "Débloquer l'Industrie.", condition: () => isEraUnlocked("industrie"), reward: { click: { production: 4, energie: 2 } } },
  { id: "m15", era: "industrie", name: "Quatre crises", text: "Compléter 4 challenges.", condition: (s) => s.completedChallenges.length >= 4, reward: { global: 0.16 } },
  { id: "m16", era: "moderne", name: "Réseau mondial", text: "Débloquer l'Ère moderne.", condition: () => isEraUnlocked("moderne"), reward: { mult: { energie: 0.5, recherche: 0.3 } } },
  { id: "m17", era: "numerique", name: "Tout devient données", text: "Débloquer l'Ère numérique.", condition: () => isEraUnlocked("numerique"), reward: { click: { donnees: 3 }, mult: { donnees: 0.5 } } },
  { id: "m18", era: "spatial", name: "Hors berceau", text: "Débloquer l'Ère spatiale.", condition: () => isEraUnlocked("spatial"), reward: { global: 0.24 } },
  { id: "m19", era: "futur", name: "Nouvelle espèce", text: "Débloquer le Futur lointain.", condition: () => isEraUnlocked("futur"), reward: { mult: { conscience: 1 } } },
  { id: "m20", era: "global", name: "Arbre dense", text: "Acheter 20 jalons.", condition: () => state.nodes.length >= 20, reward: { global: 0.25 } },
  { id: "m21", era: "global", name: "Dix producteurs", text: "Posséder 10 producteurs.", condition: () => totalProducers() >= 10, reward: { global: 0.08 } },
  { id: "m22", era: "global", name: "Cinquante producteurs", text: "Posséder 50 producteurs.", condition: () => totalProducers() >= 50, reward: { discount: 0.05, global: 0.08 } },
  { id: "m23", era: "global", name: "Historien tenace", text: "Jouer 250 actions manuelles.", condition: (s) => s.totalActions >= 250, reward: { clickAll: 0.3 } },
  { id: "m24", era: "global", name: "Héritage vivant", text: "Obtenir 1 Héritage.", condition: (s) => s.resources.heritage >= 1, reward: { global: 0.2 } }
];

const layouts = [
  { id: "thread", title: "Fil", subtitle: "Arbre et métiers", icon: "✦" },
  { id: "challenges", title: "Challenges", subtitle: "Épreuves", icon: "⚑" },
  { id: "milestones", title: "Milestones", subtitle: "Paliers", icon: "◈" },
  { id: "transmission", title: "Transmission", subtitle: "Prestige", icon: "∞" },
  { id: "archive", title: "Archive", subtitle: "Journal", icon: "✎" }
];

const elements = {
  nav: document.querySelector("#layoutNav"),
  stage: document.querySelector("#stage"),
  resourceStrip: document.querySelector("#resourceStrip"),
  activeEraName: document.querySelector("#activeEraName"),
  activeEraRange: document.querySelector("#activeEraRange"),
  activeChallengeName: document.querySelector("#activeChallengeName"),
  activeChallengeInfo: document.querySelector("#activeChallengeInfo"),
  saveStatus: document.querySelector("#saveStatus"),
  saveDialog: document.querySelector("#saveDialog"),
  savePayload: document.querySelector("#savePayload"),
  dialogTitle: document.querySelector("#dialogTitle"),
  exportSave: document.querySelector("#exportSave"),
  importSave: document.querySelector("#importSave"),
  copySave: document.querySelector("#copySave"),
  loadSave: document.querySelector("#loadSave"),
  resetSave: document.querySelector("#resetSave"),
  toasts: document.querySelector("#toasts"),
  tooltip: document.querySelector("#tooltip")
};

let state = loadState();
let lastFrame = performance.now();
let fxDirty = true;
let fxCache = null;
let ppsCache = null;
let dyn = { treeNodes: [], pills: [], gains: [], bars: [] };
let pillsKey = "";
let lastRevealed = new Set();
let revealBaseline = false;
let challengeReadyNotified = false;
let currentTip = null;

wireGlobal();
render();
requestAnimationFrame(tick);
setInterval(saveGame, 5000);
window.addEventListener("beforeunload", saveGame);

function wireGlobal() {
  elements.exportSave.addEventListener("click", () => {
    elements.dialogTitle.textContent = "Exporter";
    elements.savePayload.value = encodeSave(state);
    elements.saveDialog.showModal();
  });

  elements.importSave.addEventListener("click", () => {
    elements.dialogTitle.textContent = "Importer";
    elements.savePayload.value = "";
    elements.saveDialog.showModal();
    elements.savePayload.focus();
  });

  elements.copySave.addEventListener("click", async () => {
    await navigator.clipboard.writeText(elements.savePayload.value);
    setStatus("Sauvegarde copiée");
  });

  elements.loadSave.addEventListener("click", () => {
    try {
      state = normalizeState(decodeSave(elements.savePayload.value));
      elements.saveDialog.close();
      invalidateFx();
      challengeReadyNotified = false;
      revealBaseline = false;
      saveGame();
      render();
      setStatus("Sauvegarde importée");
    } catch {
      setStatus("Import impossible");
    }
  });

  elements.resetSave.addEventListener("click", () => {
    if (!window.confirm("Repartir de zéro sur cette sauvegarde locale ?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = createState();
    invalidateFx();
    challengeReadyNotified = false;
    revealBaseline = false;
    render();
    saveGame();
  });

  elements.stage.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action-era]");
    if (actionButton) return takeAction(actionButton.dataset.actionEra, actionButton);
    const amountButton = event.target.closest("[data-buy-amount]");
    if (amountButton) return setBuyAmount(amountButton.dataset.buyAmount);
    const producerButton = event.target.closest("[data-buy-producer]");
    if (producerButton) return buyProducer(producerButton.dataset.buyProducer);
    const nodeButton = event.target.closest("[data-buy-node]");
    if (nodeButton) return buyNode(nodeButton.dataset.buyNode);
    const eraButton = event.target.closest("[data-era]");
    if (eraButton && !eraButton.disabled) {
      state.activeEra = eraButton.dataset.era;
      state.activeLayout = "thread";
      return render();
    }
    const startButton = event.target.closest("[data-start-challenge]");
    if (startButton) return startChallenge(startButton.dataset.startChallenge);
    const completeButton = event.target.closest("[data-complete-challenge]");
    if (completeButton) return completeChallenge(completeButton.dataset.completeChallenge);
    if (event.target.closest("[data-abandon-challenge]")) return abandonChallenge();
    if (event.target.closest("[data-transmit]")) return transmitCivilization();
  });

  elements.stage.addEventListener("mouseover", (event) => {
    const anchor = event.target.closest("[data-tip]");
    if (anchor) showTip(anchor);
  });
  elements.stage.addEventListener("mouseout", (event) => {
    const anchor = event.target.closest("[data-tip]");
    if (anchor && !anchor.contains(event.relatedTarget)) hideTip();
  });
  elements.stage.addEventListener("focusin", (event) => {
    const anchor = event.target.closest("[data-tip]");
    if (anchor) showTip(anchor);
  });
  elements.stage.addEventListener("focusout", () => hideTip());
  elements.stage.addEventListener("scroll", () => hideTip(), true);
}

function createState() {
  const resources = Object.fromEntries(Object.keys(resourceMeta).map((resource) => [resource, 0]));
  resources.evolution = 10;
  resources.survie = 10;
  return {
    resources,
    producers: {},
    nodes: [],
    milestones: [],
    completedChallenges: [],
    activeChallenge: null,
    activeLayout: "thread",
    activeEra: "prehistoire",
    buyAmount: 1,
    totalActions: 0,
    totals: Object.fromEntries(Object.keys(resourceMeta).map((resource) => [resource, 0])),
    log: ["Une petite tribu cherche une ligne dans l'histoire."],
    lastTickAt: Date.now(),
    lastSavedAt: Date.now()
  };
}

function normalizeState(input) {
  const base = createState();
  const merged = { ...base, ...input };
  merged.resources = { ...base.resources, ...(input.resources || {}) };
  merged.totals = { ...base.totals, ...(input.totals || {}) };
  merged.producers = { ...(input.producers || {}) };
  merged.nodes = Array.isArray(input.nodes) ? input.nodes : [];
  merged.milestones = Array.isArray(input.milestones) ? input.milestones : [];
  merged.completedChallenges = Array.isArray(input.completedChallenges) ? input.completedChallenges : [];
  merged.log = Array.isArray(input.log) && input.log.length ? input.log : base.log;
  merged.activeEra = eraData.some((era) => era.id === input.activeEra) ? input.activeEra : "prehistoire";
  merged.activeLayout = layouts.some((layout) => layout.id === input.activeLayout) ? input.activeLayout : "thread";
  merged.buyAmount = [1, 10, "max"].includes(input.buyAmount) ? input.buyAmount : 1;
  return merged;
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createState();
  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return createState();
  }
}

function encodeSave(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeSave(text) {
  const binary = atob(text.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function tick(now) {
  const delta = Math.min((now - lastFrame) / 1000, 1);
  lastFrame = now;
  invalidateFx();
  const production = productionPerSecond();
  Object.entries(production).forEach(([resource, amount]) => {
    addResource(resource, amount * delta);
  });
  invalidateFx();
  if (state.activeChallenge && !challengeReadyNotified) {
    const challenge = getChallenge(state.activeChallenge.id);
    if (challengeProgress(challenge) >= 1) {
      challengeReadyNotified = true;
      notify("Épreuve accomplie", `${challenge.name} : objectif atteint, valide dans Challenges.`, "challenge");
    }
  }
  if (checkMilestones()) {
    render();
  } else {
    updateDynamic();
  }
  requestAnimationFrame(tick);
}

function invalidateFx() {
  fxDirty = true;
}

function effectsNow() {
  if (fxDirty) {
    fxCache = computeEffects();
    ppsCache = computeProduction(fxCache);
    fxDirty = false;
  }
  return fxCache;
}

function productionPerSecond() {
  effectsNow();
  return ppsCache;
}

// ------- Rendu -------

function render() {
  ensureActiveEra();
  applyEraTheme();
  checkMilestones();
  hideTip();
  renderNav();
  const renderers = {
    thread: renderThread,
    challenges: renderChallenges,
    milestones: renderMilestones,
    transmission: renderTransmission,
    archive: renderArchive
  };
  elements.stage.innerHTML = renderers[state.activeLayout]();
  collectDynamic();
  renderResources(true);
  detectReveals();
  updateDynamic();
}

function applyEraTheme() {
  const era = getEra(state.activeEra);
  document.body.dataset.era = era.id;
  document.body.style.setProperty("--era", era.color);
}

function renderNav() {
  elements.nav.innerHTML = layouts.map((layout) => {
    const count = layout.id === "challenges" ? state.completedChallenges.length : layout.id === "milestones" ? state.milestones.length : "";
    return `
      <button class="nav-button${state.activeLayout === layout.id ? " active" : ""}" type="button" data-layout="${layout.id}">
        <span class="nav-icon">${layout.icon}</span>
        <span class="nav-text">
          <span class="nav-title">${layout.title}</span>
          <span class="nav-subtitle">${layout.subtitle}</span>
        </span>
        <span class="${count === "" ? "lock-dot" : "count-dot"}">${count === "" ? "" : count}</span>
      </button>
    `;
  }).join("");
  elements.nav.querySelectorAll("[data-layout]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLayout = button.dataset.layout;
      render();
    });
  });
}

function renderResources(force) {
  const visible = Object.keys(resourceMeta).filter((resource) => isResourceVisible(resource));
  const key = visible.join("|");
  if (!force && key === pillsKey) return;
  pillsKey = key;
  elements.resourceStrip.innerHTML = visible.map((resource) => `
    <div class="resource-pill" data-pill="${resource}">
      <small class="pill-label">${resourceMeta[resource].label}</small>
      <strong data-pill-value></strong>
      <small class="pill-rate" data-pill-rate></small>
    </div>
  `).join("");
  dyn.pills = visible.map((resource) => {
    const root = elements.resourceStrip.querySelector(`[data-pill="${resource}"]`);
    return { resource, valueEl: root.querySelector("[data-pill-value]"), rateEl: root.querySelector("[data-pill-rate]") };
  });
}

function collectDynamic() {
  dyn = { treeNodes: [], pills: dyn.pills || [], gains: [], bars: [] };
  elements.stage.querySelectorAll("[data-buy-node]").forEach((el) => {
    const node = getNode(el.dataset.buyNode);
    if (node) dyn.treeNodes.push({ el, kind: "node", data: node });
  });
  elements.stage.querySelectorAll("[data-buy-producer]").forEach((el) => {
    const producer = getProducer(el.dataset.buyProducer);
    if (producer) dyn.treeNodes.push({ el, kind: "producer", data: producer, labelEl: el.querySelector("[data-buy-label]") });
  });
  elements.stage.querySelectorAll("[data-gain-res]").forEach((el) => {
    dyn.gains.push({ el, resource: el.dataset.gainRes });
  });
  elements.stage.querySelectorAll("[data-live-progress]").forEach((el) => {
    dyn.bars.push({ el, challengeId: el.dataset.liveProgress, textEl: el.querySelector("[data-live-progress-text]") });
  });
}

function updateDynamic() {
  renderResources(false);
  const production = productionPerSecond();
  dyn.pills.forEach(({ resource, valueEl, rateEl }) => {
    setText(valueEl, format(state.resources[resource]));
    const rate = production[resource] || 0;
    setText(rateEl, rate > 0 ? `+${format(rate)}/s` : "");
  });
  renderSideStatus();
  if (dyn.gains.length) {
    const era = getEra(state.activeEra);
    const gains = clickGains(era);
    dyn.gains.forEach(({ el, resource }) => setText(el, `+${format(gains[resource] || 0)}`));
  }
  dyn.treeNodes.forEach((entry) => {
    if (entry.kind === "node") {
      if (hasNode(entry.data.id)) {
        setNodeState(entry.el, "bought");
        return;
      }
      const available = nodeAvailable(entry.data);
      const affordable = available && canPay(nodeCost(entry.data));
      setNodeState(entry.el, affordable ? "ready" : available ? "waiting" : "locked");
    } else {
      const available = producerAvailable(entry.data);
      const info = available ? bulkBuyInfo(entry.data) : { count: 0 };
      setNodeState(entry.el, info.count >= 1 ? "ready" : available ? "waiting" : "locked");
      if (entry.labelEl) {
        setText(entry.labelEl, state.buyAmount !== 1 && info.count > 0 ? `Acheter ×${info.count}` : "");
      }
    }
  });
  dyn.bars.forEach(({ el, challengeId, textEl }) => {
    const challenge = getChallenge(challengeId);
    const progress = Math.round(challengeProgress(challenge) * 100);
    el.style.setProperty("--progress", `${progress}%`);
    if (textEl) setText(textEl, `${progress}%`);
  });
  refreshTip();
}

function setText(el, value) {
  if (el && el.textContent !== value) el.textContent = value;
}

function setNodeState(el, stateName) {
  const states = ["ready", "waiting", "locked", "bought"];
  if (el.dataset.state === stateName) return;
  el.dataset.state = stateName;
  states.forEach((name) => el.classList.toggle(name, name === stateName));
  el.setAttribute("aria-disabled", stateName === "ready" ? "false" : "true");
}

function renderSideStatus() {
  const era = getEra(state.activeEra);
  setText(elements.activeEraName, era.name);
  setText(elements.activeEraRange, era.range);
  if (state.activeChallenge) {
    const challenge = getChallenge(state.activeChallenge.id);
    const progress = challengeProgress(challenge);
    setText(elements.activeChallengeName, challenge.name);
    setText(elements.activeChallengeInfo, `${Math.round(progress * 100)} % — ${resourceMeta[challenge.goal.resource].label}`);
  } else {
    setText(elements.activeChallengeName, "Aucun");
    setText(elements.activeChallengeInfo, "Progression libre");
  }
}

function boardLayout(items) {
  if (!items.length) {
    return { width: 320, height: 220, place: () => ({ x: TREE_PAD, y: TREE_PAD }) };
  }
  const cols = items.map((item) => item.pos.c);
  const rows = items.map((item) => item.pos.r);
  const minC = Math.min(...cols);
  const maxC = Math.max(...cols);
  const minR = Math.min(...rows);
  const maxR = Math.max(...rows);
  return {
    width: TREE_PAD * 2 + (maxC - minC) * TREE_STEP + TREE_NODE,
    height: TREE_PAD * 2 + (maxR - minR) * TREE_STEP + TREE_NODE,
    place: (pos) => ({ x: TREE_PAD + (pos.c - minC) * TREE_STEP, y: TREE_PAD + (pos.r - minR) * TREE_STEP })
  };
}

function boardLinks(items, layout, getParents, isDone) {
  const byId = Object.fromEntries(items.map((item) => [item.id, item]));
  const lines = [];
  items.forEach((item) => {
    getParents(item).forEach((parentId) => {
      const parent = byId[parentId];
      if (!parent) return;
      const from = layout.place(parent.pos);
      const to = layout.place(item.pos);
      const cls = isDone(item) ? "done" : "open";
      lines.push(`<line class="${cls}" x1="${from.x + TREE_NODE / 2}" y1="${from.y + TREE_NODE / 2}" x2="${to.x + TREE_NODE / 2}" y2="${to.y + TREE_NODE / 2}"></line>`);
    });
  });
  return `<svg class="tree-links" width="${layout.width}" height="${layout.height}" viewBox="0 0 ${layout.width} ${layout.height}" aria-hidden="true">${lines.join("")}</svg>`;
}

function renderThread() {
  const era = getEra(state.activeEra);
  const threadNodes = visibleThreadNodes(era.id);
  const producerNodes = visibleProducerNodes(era.id);
  const totalEraNodes = getThreadNodes(era.id).length;
  const totalEraProducers = getProducerTreeNodes(era.id).length;
  const threadLayout = boardLayout(threadNodes);
  const producerLayout = boardLayout(producerNodes);
  const threadLinks = boardLinks(threadNodes, threadLayout, (node) => (node.requires || []).filter((id) => threadNodes.some((other) => other.id === id)), (node) => hasNode(node.id));
  const producerLinks = boardLinks(producerNodes, producerLayout, (producer) => (producer.parent && producerNodes.some((other) => other.id === producer.parent) ? [producer.parent] : []), (producer) => (state.producers[producer.id] || 0) > 0);
  const gains = clickGains(era);
  return `
    <div class="page thread-page">
      <div class="era-switcher">${visibleEraTabs().map(renderEraSwitch).join("")}</div>
      <header class="page-head">
        <div>
          <p class="kicker">Fil conducteur</p>
          <h2>${era.name}</h2>
          <p class="lede">${era.theme}</p>
        </div>
        <div class="head-meter">
          <div class="meter-label"><span>Fil historique</span><strong>${threadNodeCount(era.id)} / ${totalEraNodes}</strong></div>
          <div class="progress"><span style="--progress:${percentage(threadNodeCount(era.id), totalEraNodes)}%"></span></div>
        </div>
      </header>
      <div class="play-grid">
        <section class="command-column">
          <div class="action-card">
            <div class="action-copy">
              <p class="kicker">Action</p>
              <h3>${era.actionLabel}</h3>
              <p>${era.actionText}</p>
            </div>
            <button class="action-button" type="button" data-action-era="${era.id}">${era.actionLabel}</button>
            <div class="gain-list">
              ${Object.keys(gains).map((resource) => `<div class="gain-line"><span>${resourceMeta[resource].label}</span><strong data-gain-res="${resource}">+${format(gains[resource])}</strong></div>`).join("")}
            </div>
          </div>
          <div class="board-head">
            <div>
              <p class="kicker">Métiers et production</p>
              <h3>Arbre des ressources</h3>
            </div>
            <div class="board-head-side">
              <div class="buy-switch" role="group" aria-label="Quantité d'achat">
                ${[1, 10, "max"].map((amount) => `<button type="button" data-buy-amount="${amount}" class="${state.buyAmount === amount ? "active" : ""}">${amount === "max" ? "Max" : `×${amount}`}</button>`).join("")}
              </div>
              <strong>${producerTreeCount(era.id)} / ${totalEraProducers}</strong>
            </div>
          </div>
          <div class="tree-board producer-board">
            <div class="tree-canvas" style="width:${producerLayout.width}px;height:${producerLayout.height}px">
              ${producerLinks}
              ${producerNodes.map((producer) => producerNodeButton(producer, producerLayout)).join("")}
            </div>
          </div>
        </section>
        <section class="history-column">
          <div class="board-head">
            <div>
              <p class="kicker">Civilisation</p>
              <h3>Fil historique</h3>
            </div>
            <strong>${threadNodeCount(era.id)} / ${totalEraNodes}</strong>
          </div>
          <div class="tree-board thread-board">
            <div class="tree-canvas" style="width:${threadLayout.width}px;height:${threadLayout.height}px">
              ${threadLinks}
              ${threadNodes.map((node) => threadNodeButton(node, threadLayout)).join("")}
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderEraSwitch(era) {
  const unlocked = isEraUnlocked(era.id);
  const current = state.activeEra === era.id;
  return `
    <button class="era-tab ${current ? "active" : ""}" type="button" data-era="${era.id}" ${unlocked ? "" : "disabled"} style="--tab:${era.color}">
      <strong>${era.name}</strong>
      <span>${unlocked ? `${threadNodeCount(era.id)} / ${getThreadNodes(era.id).length} jalons` : era.unlock.label}</span>
    </button>
  `;
}

function visibleEraTabs() {
  const unlocked = unlockedEras();
  const next = eraData.find((era) => !isEraUnlocked(era.id));
  return next ? [...unlocked, next] : unlocked;
}

function threadNodeButton(node, layout) {
  const bought = hasNode(node.id);
  const isChallenge = node.kind === "challenge";
  const challenge = isChallenge ? getChallenge(node.challengeId) : null;
  const completed = challenge ? state.completedChallenges.includes(challenge.id) : false;
  const point = layout.place(node.pos);
  const sub = bought
    ? isChallenge ? (completed ? "Accomplie ✓" : "Épreuve ouverte") : "Actif ✓"
    : costShort(nodeCost(node));
  return `
    <button type="button"
      class="tree-node ${isChallenge ? "challenge" : "upgrade"}${bought ? " bought" : ""}${completed ? " done" : ""}"
      style="left:${point.x}px;top:${point.y}px"
      data-buy-node="${node.id}" data-tip="node:${node.id}">
      <span class="node-tag">${node.tag}</span>
      <span class="node-name">${node.name}</span>
      <span class="node-sub">${sub}</span>
    </button>
  `;
}

function producerNodeButton(producer, layout) {
  const owned = state.producers[producer.id] || 0;
  const point = layout.place(producer.pos);
  return `
    <button type="button"
      class="tree-node producer${owned ? " owned" : ""}"
      style="left:${point.x}px;top:${point.y}px"
      data-buy-producer="${producer.id}" data-tip="producer:${producer.id}">
      ${owned ? `<span class="node-count">×${format(owned)}</span>` : ""}
      <span class="node-tag">${producer.tag || "Métier"}</span>
      <span class="node-name">${producer.name}</span>
      <span class="node-sub">${costShort(producerCostAt(producer, owned))}</span>
      <span class="node-buy" data-buy-label></span>
    </button>
  `;
}

function costShort(cost) {
  const entries = Object.entries(cost);
  const parts = entries.slice(0, 3).map(([resource, amount]) => `${format(amount)} ${resourceMeta[resource].short}`);
  return parts.join(" · ") + (entries.length > 3 ? " …" : "");
}

function renderChallenges() {
  const active = state.activeChallenge ? getChallenge(state.activeChallenge.id) : null;
  const visibleChallenges = challengeData.filter((challenge) => isEraUnlocked(challenge.era));
  const completedVisible = visibleChallenges.filter((challenge) => state.completedChallenges.includes(challenge.id)).length;
  return `
    <div class="page">
      <header class="page-head">
        <div>
          <p class="kicker">Layout challenges</p>
          <h2>Crises historiques</h2>
          <p class="lede">Chaque challenge modifie les règles. L'objectif se mesure depuis ton entrée dans le challenge, puis la récompense reste permanente.</p>
        </div>
        <div class="head-meter">
          <div class="meter-label"><span>Complétés</span><strong>${completedVisible} / ${visibleChallenges.length}</strong></div>
          <div class="progress"><span style="--progress:${percentage(completedVisible, visibleChallenges.length)}%"></span></div>
        </div>
      </header>
      ${active ? renderActiveChallenge(active) : ""}
      ${visibleChallenges.length
        ? `<div class="challenge-grid">${visibleChallenges.map(renderChallengeCard).join("")}</div>`
        : `<section class="panel"><h3>Aucune épreuve révélée</h3><p>Les défis historiques commencent au Néolithique : cherche leurs jalons dans l'arbre.</p></section>`}
    </div>
  `;
}

function renderActiveChallenge(challenge) {
  return `
    <section class="panel active-challenge">
      <div class="panel-head">
        <div>
          <p class="kicker">Challenge actif</p>
          <h3>${challenge.name}</h3>
          <p>${challenge.text}</p>
        </div>
      </div>
      <div class="progress" data-live-progress="${challenge.id}"><span></span></div>
      <div class="dialog-actions">
        <button class="challenge-button complete" type="button" data-complete-challenge="${challenge.id}" ${challengeProgress(challenge) >= 1 ? "" : "disabled"}>Compléter</button>
        <button class="challenge-button ghost" type="button" data-abandon-challenge>Abandonner</button>
      </div>
    </section>
  `;
}

function renderChallengeCard(challenge) {
  const done = state.completedChallenges.includes(challenge.id);
  const active = state.activeChallenge && state.activeChallenge.id === challenge.id;
  const locked = !challengeAvailable(challenge);
  const progress = active ? challengeProgress(challenge) : done ? 1 : 0;
  return `
    <article class="challenge-card ${done ? "done" : ""} ${active ? "active" : ""} ${locked ? "locked" : ""}">
      <span class="node-tag">${getEra(challenge.era).name}</span>
      <h3>${challenge.name}</h3>
      <p>${challenge.text}</p>
      <p class="cost-line">Récompense : ${formatEffect(challenge.reward)}</p>
      ${active
        ? `<div class="progress" data-live-progress="${challenge.id}"><span></span></div>`
        : `<div class="progress"><span style="--progress:${Math.round(progress * 100)}%"></span></div>`}
      <button class="challenge-button" type="button" data-start-challenge="${challenge.id}" ${done || active || locked || state.activeChallenge ? "disabled" : ""}>${done ? "Complété" : active ? "Actif" : locked ? "Verrouillé" : "Entrer"}</button>
    </article>
  `;
}

function renderMilestones() {
  return `
    <div class="page">
      <header class="page-head">
        <div>
          <p class="kicker">Layout milestones</p>
          <h2>Paliers de civilisation</h2>
          <p class="lede">Les milestones se déclenchent automatiquement et ajoutent des bonus permanents. Elles servent de rythme entre les gros unlocks de l'arbre.</p>
        </div>
        <div class="head-meter">
          <div class="meter-label"><span>Milestones</span><strong>${state.milestones.length} / ${milestoneData.length}</strong></div>
          <div class="progress"><span style="--progress:${percentage(state.milestones.length, milestoneData.length)}%"></span></div>
        </div>
      </header>
      <div class="milestone-grid">
        ${milestoneData.map(renderMilestoneCard).join("")}
      </div>
    </div>
  `;
}

function renderMilestoneCard(milestone) {
  const done = state.milestones.includes(milestone.id);
  const eraLabel = milestone.era === "global" ? "Global" : getEra(milestone.era).name;
  return `
    <article class="milestone-card ${done ? "done" : "locked"}">
      <span class="milestone-tag">${eraLabel}</span>
      <h3>${milestone.name}</h3>
      <p>${milestone.text}</p>
      <p class="cost-line">${done ? "Actif" : "À venir"} : ${formatEffect(milestone.reward)}</p>
    </article>
  `;
}

function renderTransmission() {
  const gain = transmissionGain();
  const can = canTransmit();
  return `
    <div class="page">
      <header class="page-head">
        <div>
          <p class="kicker">Layout prestige</p>
          <h2>Transmission</h2>
          <p class="lede">Quand une civilisation a assez marqué l'histoire, elle transmet son héritage. Tu repars au début avec un multiplicateur global durable.</p>
        </div>
        <div class="head-meter">
          <div class="meter-label"><span>Héritage actuel</span><strong>${format(state.resources.heritage)}</strong></div>
          <div class="progress"><span style="--progress:${Math.min(100, state.resources.heritage * 12)}%"></span></div>
        </div>
      </header>
      <section class="transmission-card">
        <p class="kicker">Gain potentiel</p>
        <div class="transmission-value">+${format(gain)}</div>
        <p>${can ? "La transmission est possible. Elle garde tes challenges complétés et ton héritage." : "Débloque au moins l'Industrie ou accumule davantage de milestones et de challenges."}</p>
        <div class="stat-list">
          <div class="stat-line"><span>Jalons achetés</span><strong>${state.nodes.length}</strong></div>
          <div class="stat-line"><span>Challenges complétés</span><strong>${state.completedChallenges.length}</strong></div>
          <div class="stat-line"><span>Milestones</span><strong>${state.milestones.length}</strong></div>
          <div class="stat-line"><span>Multiplicateur héritage</span><strong>×${format(1 + state.resources.heritage * 0.12)}</strong></div>
        </div>
        <button class="action-button" type="button" data-transmit ${can ? "" : "disabled"}>Transmettre</button>
      </section>
    </div>
  `;
}

function renderArchive() {
  return `
    <div class="page">
      <header class="page-head">
        <div>
          <p class="kicker">Layout archive</p>
          <h2>Journal et état du run</h2>
          <p class="lede">Cette page garde les événements importants, utile pour suivre les unlocks pendant que l'arbre grossit.</p>
        </div>
      </header>
      <div class="two-column">
        <section class="panel">
          <div class="panel-head">
            <div>
              <p class="kicker">Journal</p>
              <h3>Derniers événements</h3>
            </div>
          </div>
          <ol class="log-list">${state.log.slice(0, 16).map((entry) => `<li>${entry}</li>`).join("")}</ol>
        </section>
        <section class="panel">
          <div class="panel-head">
            <div>
              <p class="kicker">Statistiques</p>
              <h3>Run actuel</h3>
            </div>
          </div>
          <div class="stat-list">
            <div class="stat-line"><span>Actions manuelles</span><strong>${format(state.totalActions)}</strong></div>
            <div class="stat-line"><span>Producteurs</span><strong>${format(totalProducers())}</strong></div>
            <div class="stat-line"><span>Jalons</span><strong>${format(state.nodes.length)}</strong></div>
            <div class="stat-line"><span>Challenges</span><strong>${format(state.completedChallenges.length)}</strong></div>
            <div class="stat-line"><span>Milestones</span><strong>${format(state.milestones.length)}</strong></div>
          </div>
        </section>
      </div>
    </div>
  `;
}

// ------- Tooltip -------

function showTip(anchor) {
  currentTip = { key: anchor.dataset.tip, anchor };
  elements.tooltip.hidden = false;
  refreshTip(true);
}

function hideTip() {
  currentTip = null;
  elements.tooltip.hidden = true;
}

function refreshTip(reposition = false) {
  if (!currentTip) return;
  if (!document.contains(currentTip.anchor)) {
    hideTip();
    return;
  }
  const content = buildTipContent(currentTip.key);
  if (!content) {
    hideTip();
    return;
  }
  elements.tooltip.innerHTML = content;
  placeTip(currentTip.anchor);
  void reposition;
}

function placeTip(anchor) {
  const rect = anchor.getBoundingClientRect();
  const tip = elements.tooltip;
  const width = tip.offsetWidth;
  const height = tip.offsetHeight;
  let x = rect.right + 12;
  if (x + width > window.innerWidth - 8) x = rect.left - width - 12;
  if (x < 8) x = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);
  let y = rect.top + rect.height / 2 - height / 2;
  y = Math.max(8, Math.min(y, window.innerHeight - height - 8));
  tip.style.left = `${Math.round(x)}px`;
  tip.style.top = `${Math.round(y)}px`;
}

function buildTipContent(key) {
  const [type, id] = key.split(":");
  if (type === "producer") return producerTip(getProducer(id));
  if (type === "node") {
    const node = getNode(id);
    if (!node) return "";
    return node.kind === "challenge" || id.startsWith("challenge-") ? challengeNodeTip(node) : nodeTip(node);
  }
  return "";
}

function costLines(cost) {
  return Object.entries(cost).map(([resource, amount]) => {
    const has = state.resources[resource] || 0;
    const ok = has >= amount;
    return `<div class="tip-cost ${ok ? "ok" : "ko"}"><span>${resourceMeta[resource].label}</span><strong>${format(has)} / ${format(amount)}</strong></div>`;
  }).join("");
}

function nodeTip(node) {
  const bought = hasNode(node.id);
  const requirement = !bought && !nodeAvailable(node) ? requirementText(node) : "";
  return `
    <header><strong>${node.name}</strong><span class="tip-tag">${node.tag}</span></header>
    <p>${node.text}</p>
    ${bought
      ? `<div class="tip-block done">Bonus actif : ${formatEffect(node.effects)}</div>`
      : `
        <div class="tip-block">${costLines(nodeCost(node))}</div>
        ${requirement ? `<div class="tip-block warn">${requirement}</div>` : ""}
        <div class="tip-block">Effet : ${formatEffect(node.effects)}</div>
      `}
  `;
}

function challengeNodeTip(node) {
  const challenge = getChallenge(node.challengeId || node.id.replace("challenge-", ""));
  const bought = hasNode(node.id);
  const completed = state.completedChallenges.includes(challenge.id);
  const requirement = !bought && !nodeAvailable(node) ? requirementText(node) : "";
  return `
    <header><strong>${challenge.name}</strong><span class="tip-tag">Épreuve</span></header>
    <p>${challenge.text}</p>
    ${completed
      ? `<div class="tip-block done">Accomplie — récompense active : ${formatEffect(challenge.reward)}</div>`
      : bought
        ? `<div class="tip-block">Épreuve débloquée : lance-la depuis le layout Challenges.</div>`
        : `
          <div class="tip-block">${costLines(nodeCost(node))}</div>
          ${requirement ? `<div class="tip-block warn">${requirement}</div>` : ""}
        `}
    <div class="tip-block">Récompense : ${formatEffect(challenge.reward)}</div>
  `;
}

function producerTip(producer) {
  const owned = state.producers[producer.id] || 0;
  const available = producerAvailable(producer);
  const cost = producerCostAt(producer, owned);
  const produces = producerProduces(producer, effectsNow());
  const nextBulkAt = (Math.floor(owned / 10) + 1) * 10;
  const requirement = !available ? producerRequirementText(producer) : "";
  const info = available && state.buyAmount !== 1 ? bulkBuyInfo(producer) : null;
  return `
    <header><strong>${producer.name}</strong><span class="tip-tag">×${format(owned)}</span></header>
    <p>${producer.text}</p>
    <div class="tip-block">
      ${Object.entries(produces).map(([resource, amount]) => `<div class="tip-cost"><span>${resourceMeta[resource].label}</span><strong>+${format(amount * Math.max(owned, 1))}/s${owned > 1 ? ` (${format(amount)}/u)` : ""}</strong></div>`).join("")}
    </div>
    <div class="tip-block">Palier ×${format(producerBulkBonus(producer))} — prochain saut à ${nextBulkAt} unités.</div>
    ${requirement
      ? `<div class="tip-block warn">${requirement}</div>`
      : `<div class="tip-block">${costLines(cost)}</div>
        ${info && info.count > 0 ? `<div class="tip-block">Achat ×${info.count} : ${costShort(info.total)}</div>` : ""}`}
  `;
}

// ------- Actions -------

function takeAction(eraId, button) {
  const era = getEra(eraId);
  const gains = clickGains(era);
  Object.entries(gains).forEach(([resource, amount]) => addResource(resource, amount));
  state.totalActions += 1;
  invalidateFx();
  spawnFloat(button, `+${format(gains.evolution)} Évo`);
  if (checkMilestones()) {
    render();
  } else {
    updateDynamic();
  }
}

function spawnFloat(button, text) {
  const host = button.parentElement;
  if (!host) return;
  const float = document.createElement("span");
  float.className = "gain-float";
  float.textContent = text;
  float.style.left = `${30 + Math.random() * 40}%`;
  host.append(float);
  setTimeout(() => float.remove(), 950);
}

function setBuyAmount(raw) {
  state.buyAmount = raw === "max" ? "max" : Number(raw);
  render();
}

function buyProducer(id) {
  const producer = getProducer(id);
  if (!producer || !producerAvailable(producer)) return;
  const info = bulkBuyInfo(producer);
  if (info.count < 1) return;
  pay(info.total);
  state.producers[id] = (state.producers[id] || 0) + info.count;
  invalidateFx();
  const era = getEraForProducer(id);
  addLog(info.count > 1 ? `${info.count} × ${producer.name} rejoignent ${era.name}.` : `${producer.name} rejoint ${era.name}.`);
  checkMilestones();
  render();
}

function buyNode(id) {
  const node = getNode(id);
  if (!node) return;
  const cost = nodeCost(node);
  if (hasNode(id) || !nodeAvailable(node) || !canPay(cost)) return;
  pay(cost);
  state.nodes.push(id);
  invalidateFx();
  const era = getEraForNode(id);
  addLog(`${node.name} débloqué dans ${era.name}.`);
  if (id.startsWith("challenge-")) {
    const challenge = getChallenge(id.replace("challenge-", ""));
    notify("Épreuve débloquée", `${challenge.name} est disponible dans Challenges.`, "challenge");
  }
  const unlockedEra = eraData.find((item) => item.unlock && item.unlock.node === id);
  if (unlockedEra) {
    notify("Époque débloquée", `${unlockedEra.name} s'ouvre dans le fil.`, "era");
  }
  if (state.activeLayout === "thread") state.activeEra = era.id;
  checkMilestones();
  render();
}

function startChallenge(id) {
  const challenge = getChallenge(id);
  if (!challengeAvailable(challenge) || state.completedChallenges.includes(id) || state.activeChallenge) return;
  const backup = snapshotChallengeState();
  resetForChallenge(challenge);
  state.activeChallenge = {
    id,
    era: challenge.era,
    start: { ...state.resources },
    startedAt: Date.now(),
    backup
  };
  state.activeEra = challenge.era;
  state.activeLayout = "thread";
  challengeReadyNotified = false;
  invalidateFx();
  addLog(`Challenge commencé : ${challenge.name}.`);
  render();
}

function completeChallenge(id) {
  const challenge = getChallenge(id);
  if (!state.activeChallenge || state.activeChallenge.id !== id || challengeProgress(challenge) < 1) return;
  const backup = state.activeChallenge.backup;
  restoreChallengeState(backup);
  state.completedChallenges.push(id);
  state.activeChallenge = null;
  state.activeEra = challenge.era;
  state.activeLayout = "challenges";
  challengeReadyNotified = false;
  invalidateFx();
  addLog(`Challenge complété : ${challenge.name}.`);
  notify("Challenge complété", `${challenge.name} — ${formatEffect(challenge.reward)}`, "challenge");
  checkMilestones();
  render();
}

function abandonChallenge() {
  if (!state.activeChallenge) return;
  const challenge = getChallenge(state.activeChallenge.id);
  const backup = state.activeChallenge.backup;
  restoreChallengeState(backup);
  addLog(`Challenge abandonné : ${challenge.name}.`);
  state.activeChallenge = null;
  state.activeEra = challenge.era;
  state.activeLayout = "challenges";
  challengeReadyNotified = false;
  invalidateFx();
  render();
}

function snapshotChallengeState() {
  return {
    resources: { ...state.resources },
    producers: { ...state.producers },
    nodes: [...state.nodes],
    milestones: [...state.milestones],
    completedChallenges: [...state.completedChallenges],
    totals: { ...state.totals },
    activeEra: state.activeEra,
    activeLayout: state.activeLayout,
    totalActions: state.totalActions,
    log: [...state.log]
  };
}

function restoreChallengeState(backup) {
  state.resources = { ...backup.resources };
  state.producers = { ...backup.producers };
  state.nodes = [...backup.nodes];
  state.milestones = [...backup.milestones];
  state.completedChallenges = [...backup.completedChallenges];
  state.totals = { ...backup.totals };
  state.activeEra = backup.activeEra;
  state.activeLayout = backup.activeLayout;
  state.totalActions = backup.totalActions;
  state.log = [...backup.log];
}

function resetForChallenge(challenge) {
  const eraIndex = eraData.findIndex((era) => era.id === challenge.era);
  const resetEras = eraData.slice(eraIndex);
  const resetResources = new Set(resetEras.flatMap((era) => eraResourceKeys(era.id)));
  resetResources.forEach((resource) => {
    if (resource !== "evolution" && resource !== "heritage") state.resources[resource] = 0;
  });
  resetEras.flatMap((era) => era.generators).forEach((producer) => {
    state.producers[producer.id] = 0;
  });
  const resetNodeIds = new Set(resetEras.flatMap((era) => getThreadNodes(era.id).map((node) => node.id)));
  state.nodes = state.nodes.filter((nodeId) => !resetNodeIds.has(nodeId));
  const era = getEra(challenge.era);
  Object.entries(era.action).forEach(([resource, amount]) => {
    state.resources[resource] = Math.max(state.resources[resource] || 0, amount * 8);
  });
  state.resources.evolution = Math.max(state.resources.evolution, 10 * Math.pow(5, eraIndex));
}

function transmitCivilization() {
  if (!canTransmit()) return;
  const heritageGain = transmissionGain();
  if (!window.confirm(`Transmettre l'héritage ? La civilisation repart de zéro avec +${format(heritageGain)} Héritage.`)) return;
  const keptHeritage = state.resources.heritage + heritageGain;
  const keptChallenges = [...state.completedChallenges];
  state = createState();
  state.resources.heritage = keptHeritage;
  state.completedChallenges = keptChallenges;
  invalidateFx();
  challengeReadyNotified = false;
  revealBaseline = false;
  addLog(`Transmission accomplie : +${format(heritageGain)} Héritage.`);
  notify("Transmission accomplie", `+${format(heritageGain)} Héritage conservé.`, "era");
  saveGame();
  render();
}

// ------- Économie -------

function computeProduction(effects) {
  const output = {};
  eraData.forEach((era) => {
    if (!isEraUnlocked(era.id)) return;
    era.generators.forEach((producer) => {
      const owned = state.producers[producer.id] || 0;
      if (!owned) return;
      if (producer.requires && !producer.requires.every(hasNode)) return;
      const produces = producerProduces(producer, effects);
      Object.entries(produces).forEach(([resource, amount]) => {
        output[resource] = (output[resource] || 0) + amount * owned;
      });
    });
  });
  return output;
}

function producerProduces(producer, effects = effectsNow()) {
  const challenge = activeChallengeData();
  const bulkBonus = producerBulkBonus(producer);
  const result = {};
  Object.entries(producer.produces).forEach(([resource, amount]) => {
    const specific = effects.generator[producer.id] || 0;
    const resourceMult = effects.resource[resource] || 1;
    const challengeResource = challenge && challenge.modifiers.resource && challenge.modifiers.resource[resource] !== undefined ? challenge.modifiers.resource[resource] : 1;
    result[resource] = amount * effects.global * resourceMult * (1 + specific) * effects.passive * challengeResource * bulkBonus;
  });
  const era = getEraForProducer(producer.id);
  const eraIndex = eraData.findIndex((item) => item.id === era.id);
  const pacing = eraPacing[era.id] || {};
  const evolutionBase = (pacing.passiveEvolution || 0.08) * Math.pow(5.2, Math.max(0, eraIndex));
  const evolutionChallenge = challenge && challenge.modifiers.resource && challenge.modifiers.resource.evolution !== undefined ? challenge.modifiers.resource.evolution : 1;
  result.evolution = (result.evolution || 0) + evolutionBase * effects.global * (effects.resource.evolution || 1) * effects.passive * evolutionChallenge * bulkBonus;
  return result;
}

function producerBulkBonus(producer) {
  const owned = state.producers[producer.id] || 0;
  return Math.pow(1.7, Math.floor(owned / 10));
}

function clickGains(era) {
  const effects = effectsNow();
  const challenge = activeChallengeData();
  const challengeClick = challenge && challenge.modifiers.click !== undefined ? challenge.modifiers.click : 1;
  const gains = {};
  Object.entries(era.action).forEach(([resource, amount]) => {
    const clickExtra = effects.click[resource] || 0;
    const resourceMult = effects.resource[resource] || 1;
    const allClick = 1 + effects.clickAll;
    gains[resource] = (amount + clickExtra) * resourceMult * allClick * challengeClick;
  });
  const eraIndex = eraData.findIndex((item) => item.id === era.id);
  const pacing = eraPacing[era.id] || {};
  const evolutionBase = (pacing.actionEvolution || 1) * Math.pow(4.25, Math.max(0, eraIndex));
  const evolutionMult = effects.resource.evolution || 1;
  gains.evolution = (gains.evolution || 0) + evolutionBase * evolutionMult * (1 + effects.clickAll) * challengeClick;
  return gains;
}

function computeEffects() {
  const effects = {
    global: 1 + state.resources.heritage * 0.12,
    passive: 1,
    resource: Object.fromEntries(Object.keys(resourceMeta).map((resource) => [resource, 1])),
    click: {},
    clickAll: 0,
    generator: {},
    discount: 0
  };
  effects.global += Math.log10(1 + Math.max(0, state.resources.evolution)) * 0.035;
  const apply = (effect) => {
    if (!effect) return;
    if (effect.global) effects.global += effect.global;
    if (effect.clickAll) effects.clickAll += effect.clickAll;
    if (effect.discount) effects.discount += effect.discount;
    Object.entries(effect.click || {}).forEach(([resource, amount]) => {
      effects.click[resource] = (effects.click[resource] || 0) + amount;
    });
    Object.entries(effect.mult || {}).forEach(([resource, amount]) => {
      effects.resource[resource] = (effects.resource[resource] || 1) + amount;
    });
    Object.entries(effect.generator || {}).forEach(([producer, amount]) => {
      effects.generator[producer] = (effects.generator[producer] || 0) + amount;
    });
  };
  state.nodes.map(getNode).forEach((node) => node && apply(node.effects));
  state.completedChallenges.map(getChallenge).forEach((challenge) => challenge && apply(challenge.reward));
  state.milestones.map(getMilestone).forEach((milestone) => milestone && apply(milestone.reward));
  const challenge = activeChallengeData();
  if (challenge && challenge.modifiers.passive !== undefined) effects.passive *= challenge.modifiers.passive;
  return effects;
}

function addResource(resource, amount) {
  if (!Number.isFinite(amount) || amount <= 0) return;
  state.resources[resource] += amount;
  state.totals[resource] = (state.totals[resource] || 0) + amount;
}

function pay(cost) {
  Object.entries(cost).forEach(([resource, amount]) => {
    state.resources[resource] -= amount;
  });
  invalidateFx();
}

function canPay(cost) {
  return Object.entries(cost).every(([resource, amount]) => state.resources[resource] >= amount);
}

function producerCostAt(producer, owned) {
  const effects = effectsNow();
  const challenge = activeChallengeData();
  const challengeCost = challenge && challenge.modifiers.cost ? challenge.modifiers.cost : 1;
  const discount = Math.max(0.35, 1 - effects.discount);
  const cost = Object.fromEntries(Object.entries(producer.cost).map(([resource, amount]) => [
    resource,
    Math.ceil(amount * Math.pow(producer.scale, owned) * challengeCost * discount)
  ]));
  const era = getEraForProducer(producer.id);
  const eraIndex = eraData.findIndex((item) => item.id === era.id);
  const pacing = eraPacing[era.id] || {};
  const evolutionCost = 14 * (pacing.producerEvolutionCost || 1) * Math.pow(7.5, Math.max(0, eraIndex)) * Math.pow(producer.scale, owned) * challengeCost * discount;
  cost.evolution = Math.max(cost.evolution || 0, Math.ceil(evolutionCost));
  return cost;
}

function bulkBuyInfo(producer) {
  const target = state.buyAmount === "max" ? 500 : state.buyAmount;
  const owned = state.producers[producer.id] || 0;
  const remaining = { ...state.resources };
  const total = {};
  let count = 0;
  for (let i = 0; i < target; i += 1) {
    const cost = producerCostAt(producer, owned + count);
    if (!Object.entries(cost).every(([resource, amount]) => (remaining[resource] || 0) >= amount)) break;
    Object.entries(cost).forEach(([resource, amount]) => {
      remaining[resource] -= amount;
      total[resource] = (total[resource] || 0) + amount;
    });
    count += 1;
  }
  return { count, total };
}

function nodeCost(node) {
  const effects = effectsNow();
  const challenge = activeChallengeData();
  const challengeCost = challenge && challenge.modifiers.cost ? challenge.modifiers.cost : 1;
  const discount = Math.max(0.4, 1 - effects.discount * 0.6);
  const cost = Object.fromEntries(Object.entries(node.cost).map(([resource, amount]) => [
    resource,
    Math.ceil(amount * challengeCost * discount)
  ]));
  const era = getEraForNode(node.id);
  const eraIndex = eraData.findIndex((item) => item.id === era.id);
  const pacing = eraPacing[era.id] || {};
  const evolutionCost = 35 * (pacing.nodeEvolutionCost || 1) * Math.pow(8.5, Math.max(0, eraIndex)) * challengeCost * discount;
  if (!Object.prototype.hasOwnProperty.call(node.cost, "evolution")) {
    cost.evolution = Math.ceil(evolutionCost);
  }
  return cost;
}

function checkMilestones() {
  let unlocked = false;
  milestoneData.forEach((milestone) => {
    if (!state.milestones.includes(milestone.id) && milestone.condition(state)) {
      state.milestones.push(milestone.id);
      addLog(`Milestone : ${milestone.name}.`);
      notify("Palier atteint", `${milestone.name} — ${formatEffect(milestone.reward)}`, "milestone");
      unlocked = true;
    }
  });
  if (unlocked) invalidateFx();
  return unlocked;
}

// ------- Disponibilité -------

function nodeAvailable(node) {
  return nodeRevealed(node) && producerRequirementsMet(node.producerRequires) && resourceRequirementsMet(node.resourceRequires);
}

function nodeRevealed(node) {
  return nodeRequirementsMet(node.requires);
}

function producerAvailable(producer) {
  return producerRevealed(producer) && producerRequirementsMet(producer.producerRequires) && resourceRequirementsMet(producer.resourceRequires);
}

function producerRevealed(producer) {
  if ((state.producers[producer.id] || 0) > 0) return true;
  const parentReady = !producer.parent || (state.producers[producer.parent] || 0) > 0;
  return parentReady && nodeRequirementsMet(producer.requires);
}

function nodeRequirementsMet(requirements = []) {
  return requirements.every(hasNode);
}

function producerRequirementsMet(requirements = {}) {
  return Object.entries(requirements).every(([producerId, amount]) => (state.producers[producerId] || 0) >= amount);
}

function resourceRequirementsMet(requirements = {}) {
  return Object.entries(requirements).every(([resource, amount]) => state.resources[resource] >= amount);
}

function challengeAvailable(challenge) {
  return isEraUnlocked(challenge.era) && hasNode(challengeUnlockNodeId(challenge.id));
}

function challengeProgress(challenge) {
  if (!state.activeChallenge || state.activeChallenge.id !== challenge.id) {
    return state.completedChallenges.includes(challenge.id) ? 1 : 0;
  }
  const start = state.activeChallenge.start[challenge.goal.resource] || 0;
  const gained = Math.max(0, state.resources[challenge.goal.resource] - start);
  return Math.min(1, gained / challenge.goal.amount);
}

function canTransmit() {
  return isEraUnlocked("industrie") || state.completedChallenges.length >= 5 || state.milestones.length >= 16;
}

function transmissionGain() {
  const totalEarned = Object.values(state.totals).reduce((sum, value) => sum + value, 0);
  const raw = Math.sqrt(totalEarned / 250000) + state.completedChallenges.length * 0.75 + state.milestones.length * 0.18 + state.nodes.length * 0.08;
  return Math.max(canTransmit() ? 1 : 0, Math.floor(raw));
}

function isEraUnlocked(id) {
  const era = getEra(id);
  if (!era.unlock) return true;
  return hasNode(era.unlock.node) || state.resources.heritage > 0;
}

function ensureActiveEra() {
  if (!isEraUnlocked(state.activeEra)) {
    state.activeEra = unlockedEras().at(-1).id;
  }
}

function unlockedEras() {
  return eraData.filter((era) => isEraUnlocked(era.id));
}

function isResourceVisible(resource) {
  if (resource === "evolution") return true;
  if (resource === "heritage") return state.resources.heritage > 0 || canTransmit();
  if (state.resources[resource] > 0.0001) return true;
  if ((productionPerSecond()[resource] || 0) > 0) return true;
  const activeEra = getEra(state.activeEra);
  if (Object.prototype.hasOwnProperty.call(activeEra.action, resource)) return true;
  return state.nodes.some((nodeId) => {
    const node = getNode(nodeId);
    return node && node.effects && node.effects.click && Object.prototype.hasOwnProperty.call(node.effects.click, resource);
  });
}

// ------- Révélations et toasts -------

function detectReveals() {
  const revealedNow = new Set();
  const labels = new Map();
  eraData.forEach((era) => {
    if (!isEraUnlocked(era.id)) return;
    getThreadNodes(era.id).forEach((node) => {
      if (!hasNode(node.id) && nodeRevealed(node)) {
        revealedNow.add(`n:${node.id}`);
        labels.set(`n:${node.id}`, node.kind === "challenge" ? `Épreuve : ${getChallenge(node.challengeId).name}` : node.name);
      }
    });
    era.generators.forEach((producer) => {
      if (producerRevealed(producer)) {
        revealedNow.add(`p:${producer.id}`);
        labels.set(`p:${producer.id}`, producer.name);
      }
    });
  });
  if (revealBaseline) {
    const fresh = [...revealedNow].filter((key) => !lastRevealed.has(key));
    if (fresh.length > 3) {
      notify("Nouvelles révélations", `${fresh.length} découvertes dans l'arbre.`, "reveal");
    } else {
      fresh.forEach((key) => {
        notify(key.startsWith("p:") ? "Métier révélé" : "Jalon révélé", labels.get(key), "reveal");
      });
    }
  }
  lastRevealed = revealedNow;
  revealBaseline = true;
}

function notify(title, text, tone = "info") {
  const host = elements.toasts;
  if (!host) return;
  const toast = document.createElement("div");
  toast.className = `toast ${tone}`;
  toast.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
  host.append(toast);
  while (host.children.length > 5) host.firstElementChild.remove();
  setTimeout(() => {
    toast.classList.add("out");
    setTimeout(() => toast.remove(), 300);
  }, 4600);
}

// ------- Accès aux données -------

function hasNode(id) {
  return state.nodes.includes(id);
}

function getEra(id) {
  return eraData.find((era) => era.id === id);
}

function getNode(id) {
  for (const era of eraData) {
    const node = era.nodes.find((item) => item.id === id);
    if (node) return node;
  }
  if (id.startsWith("challenge-")) return getChallengeUnlockNode(id);
  return null;
}

function getProducer(id) {
  for (const era of eraData) {
    const producer = era.generators.find((item) => item.id === id);
    if (producer) return producer;
  }
  return null;
}

function getChallenge(id) {
  return challengeData.find((challenge) => challenge.id === id);
}

function getMilestone(id) {
  return milestoneData.find((milestone) => milestone.id === id);
}

function getThreadNodes(eraId) {
  const era = getEra(eraId);
  const upgrades = era.nodes.map((node) => ({ ...node, kind: "upgrade" }));
  const challengeNodes = challengeData
    .filter((challenge) => challenge.era === eraId)
    .map((challenge) => getChallengeUnlockNode(challengeUnlockNodeId(challenge.id)));
  return [...upgrades, ...challengeNodes];
}

function getProducerTreeNodes(eraId) {
  const era = getEra(eraId);
  return era.generators.map((producer) => ({ ...producer, kind: "producer", tag: producer.tag || "Métier" }));
}

function visibleThreadNodes(eraId) {
  return getThreadNodes(eraId).filter((node) => hasNode(node.id) || nodeRevealed(node));
}

function visibleProducerNodes(eraId) {
  return getProducerTreeNodes(eraId).filter((producer) => producerRevealed(producer));
}

function threadNodeCount(eraId) {
  return getThreadNodes(eraId).filter((node) => hasNode(node.id)).length;
}

function producerTreeCount(eraId) {
  return getProducerTreeNodes(eraId).filter((producer) => (state.producers[producer.id] || 0) > 0).length;
}

function challengeUnlockNodeId(challengeId) {
  return `challenge-${challengeId}`;
}

function getChallengeUnlockNode(id) {
  const challengeId = id.replace("challenge-", "");
  const challenge = getChallenge(challengeId);
  return {
    id,
    kind: "challenge",
    challengeId,
    name: `Épreuve : ${challenge.name}`,
    tag: "Challenge",
    text: `Débloque le challenge « ${challenge.name} ». ${challenge.text}`,
    cost: challengeUnlockCost(challenge),
    requires: challenge.requires || [],
    pos: challenge.pos,
    effects: {}
  };
}

function challengeUnlockCost(challenge) {
  const eraIndex = eraData.findIndex((era) => era.id === challenge.era);
  const pacing = eraPacing[challenge.era] || {};
  const goalResource = challenge.goal.resource;
  return {
    evolution: Math.ceil(55 * (pacing.challengeEvolutionCost || 1) * Math.pow(8.5, eraIndex)),
    [goalResource]: Math.ceil(challenge.goal.amount * 0.34)
  };
}

function getEraForNode(id) {
  if (id.startsWith("challenge-")) {
    const challenge = getChallenge(id.replace("challenge-", ""));
    return getEra(challenge.era);
  }
  return eraData.find((era) => era.nodes.some((node) => node.id === id));
}

function getEraForProducer(id) {
  return eraData.find((era) => era.generators.some((producer) => producer.id === id));
}

function activeChallengeData() {
  return state.activeChallenge ? getChallenge(state.activeChallenge.id) : null;
}

function eraResourceKeys(eraId) {
  const era = getEra(eraId);
  const resources = new Set(Object.keys(era.action));
  era.generators.forEach((producer) => {
    Object.keys(producer.cost).forEach((resource) => resources.add(resource));
    Object.keys(producer.produces).forEach((resource) => resources.add(resource));
  });
  era.nodes.forEach((node) => {
    Object.keys(node.cost).forEach((resource) => resources.add(resource));
    Object.keys(node.effects?.click || {}).forEach((resource) => resources.add(resource));
    Object.keys(node.effects?.mult || {}).forEach((resource) => resources.add(resource));
  });
  challengeData.filter((challenge) => challenge.era === eraId).forEach((challenge) => {
    resources.add(challenge.goal.resource);
    Object.keys(challenge.reward?.click || {}).forEach((resource) => resources.add(resource));
    Object.keys(challenge.reward?.mult || {}).forEach((resource) => resources.add(resource));
  });
  return [...resources];
}

function eraNodeCount(eraId) {
  const era = getEra(eraId);
  return era.nodes.filter((node) => hasNode(node.id)).length;
}

function eraProducerCount(eraId) {
  const era = getEra(eraId);
  return era.generators.reduce((sum, producer) => sum + (state.producers[producer.id] || 0), 0);
}

function totalProducers() {
  return Object.values(state.producers).reduce((sum, value) => sum + value, 0);
}

// ------- Formats -------

function percentage(value, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function formatCost(cost) {
  return Object.entries(cost).map(([resource, amount]) => `${format(amount)} ${resourceMeta[resource].short}`).join(" | ");
}

function formatProduces(produces) {
  return Object.entries(produces).map(([resource, amount]) => `+${format(amount)} ${resourceMeta[resource].short}/s`).join(" | ");
}

function requirementText(node) {
  const requirements = [];
  (node.requires || []).forEach((id) => {
    if (!hasNode(id)) requirements.push(getNode(id).name);
  });
  Object.entries(node.producerRequires || {}).forEach(([producerId, amount]) => {
    if ((state.producers[producerId] || 0) < amount) requirements.push(`${format(amount)} ${getProducer(producerId).name}`);
  });
  Object.entries(node.resourceRequires || {}).forEach(([resource, amount]) => {
    if (state.resources[resource] < amount) requirements.push(`${format(amount)} ${resourceMeta[resource].label}`);
  });
  return requirements.length ? `Requiert ${requirements.join(" + ")}` : "Verrouillé";
}

function producerRequirementText(producer) {
  const requirements = [];
  if (producer.parent && (state.producers[producer.parent] || 0) <= 0) {
    requirements.push(getProducer(producer.parent).name);
  }
  (producer.requires || []).forEach((id) => {
    if (!hasNode(id)) requirements.push(getNode(id).name);
  });
  Object.entries(producer.producerRequires || {}).forEach(([producerId, amount]) => {
    if ((state.producers[producerId] || 0) < amount) requirements.push(`${format(amount)} ${getProducer(producerId).name}`);
  });
  Object.entries(producer.resourceRequires || {}).forEach(([resource, amount]) => {
    if (state.resources[resource] < amount) requirements.push(`${format(amount)} ${resourceMeta[resource].label}`);
  });
  return requirements.length ? `Requiert ${requirements.join(" + ")}` : "Verrouillé";
}

function formatEffect(effect) {
  const parts = [];
  if (effect.global) parts.push(`global +${Math.round(effect.global * 100)} %`);
  if (effect.discount) parts.push(`coûts -${Math.round(effect.discount * 100)} %`);
  if (effect.clickAll) parts.push(`clics +${Math.round(effect.clickAll * 100)} %`);
  Object.entries(effect.mult || {}).forEach(([resource, amount]) => parts.push(`${resourceMeta[resource].label} +${Math.round(amount * 100)} %`));
  Object.entries(effect.click || {}).forEach(([resource, amount]) => parts.push(`clic ${resourceMeta[resource].label} +${format(amount)}`));
  Object.entries(effect.generator || {}).forEach(([producerId, amount]) => {
    const producer = getProducer(producerId);
    parts.push(`${producer ? producer.name : producerId} +${Math.round(amount * 100)} %`);
  });
  return parts.join(", ") || "bonus permanent";
}

function addLog(message) {
  state.log = [message, ...state.log].slice(0, 40);
}

function saveGame() {
  state.lastSavedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  setStatus("Sauvegarde auto");
}

function setStatus(text) {
  elements.saveStatus.textContent = text;
  window.clearTimeout(setStatus.timeout);
  setStatus.timeout = window.setTimeout(() => {
    elements.saveStatus.textContent = "Sauvegarde prête";
  }, 1600);
}

function format(value) {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) < 1000) {
    const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
    return value.toFixed(digits).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
  }
  const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
  let scaled = value;
  let unit = "";
  for (const next of units) {
    scaled /= 1000;
    unit = next;
    if (Math.abs(scaled) < 1000) break;
  }
  const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  return `${scaled.toFixed(digits)}${unit}`;
}
