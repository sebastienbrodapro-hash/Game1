const STORAGE_KEY = "chronique-incrementale-v1";

const resourceMeta = {
  evolution: { label: "Points d'evolution", short: "Evo" },
  survie: { label: "Survie", short: "Sur" },
  nourriture: { label: "Nourriture", short: "Nou" },
  pierre: { label: "Pierre", short: "Pie" },
  savoir: { label: "Savoir", short: "Sav" },
  population: { label: "Population", short: "Pop" },
  influence: { label: "Influence", short: "Inf" },
  artisanat: { label: "Artisanat", short: "Art" },
  idees: { label: "Idees", short: "Ide" },
  energie: { label: "Energie", short: "Ene" },
  production: { label: "Production", short: "Pro" },
  recherche: { label: "Recherche", short: "Rec" },
  donnees: { label: "Donnees", short: "Don" },
  calcul: { label: "Calcul", short: "Cal" },
  colonies: { label: "Colonies", short: "Col" },
  conscience: { label: "Conscience", short: "Con" },
  heritage: { label: "Heritage", short: "Her" }
};

const eraData = [
  {
    id: "prehistoire",
    name: "Prehistoire",
    range: "2.5M - 10 000 av. J.-C.",
    theme: "La tribu apprend a survivre, transmettre et garder le feu.",
    actionLabel: "Organiser la tribu",
    actionText: "Gagne de la survie et un peu de nourriture.",
    action: { survie: 1.15, nourriture: 0.15 },
    unlock: null,
    generators: [
      { id: "cueilleurs", name: "Cueilleurs", text: "Ils ramassent ce qui nourrit la tribu.", cost: { survie: 18 }, scale: 1.18, produces: { nourriture: 0.055, survie: 0.0017 }, position: { x: 34, y: 38 } },
      { id: "ramasseursGalets", name: "Ramasseurs de galets", text: "Ils cherchent les pierres utiles autour du camp.", cost: { survie: 68, nourriture: 18 }, scale: 1.18, produces: { pierre: 0.075 }, requires: ["feu"], parent: "cueilleurs", position: { x: 258, y: 38 } },
      { id: "tailleursBruts", name: "Tailleurs sans atelier", text: "La pierre devient outil avant meme d'avoir un atelier.", cost: { pierre: 72, nourriture: 80 }, scale: 1.2, produces: { pierre: 0.18, savoir: 0.012 }, requires: ["outils"], producerRequires: { ramasseursGalets: 4 }, resourceRequires: { pierre: 80 }, parent: "ramasseursGalets", position: { x: 258, y: 218 } },
      { id: "tablesTaillage", name: "Tables de taillage", text: "Un poste fixe stabilise le geste et prepare les tailleurs V2.", cost: { pierre: 420, survie: 520 }, scale: 1.28, produces: { pierre: 0.34, savoir: 0.025 }, requires: ["outils"], producerRequires: { tailleursBruts: 8 }, resourceRequires: { pierre: 420 }, parent: "tailleursBruts", position: { x: 482, y: 218 } },
      { id: "chasseurs", name: "Chasseurs", text: "Ils rapportent des peaux, des outils et de la securite.", cost: { nourriture: 90, pierre: 48 }, scale: 1.19, produces: { survie: 0.18 }, requires: ["pistes"], producerRequires: { tailleursBruts: 4 }, parent: "tailleursBruts", position: { x: 34, y: 398 } },
      { id: "tailleursAtelier", name: "Tailleurs V2", text: "Une table, une sequence, un rendement qui change d'echelle.", cost: { pierre: 760, savoir: 32 }, scale: 1.22, produces: { pierre: 0.7, savoir: 0.09 }, requires: ["pistes"], producerRequires: { tablesTaillage: 1 }, resourceRequires: { pierre: 650 }, parent: "tablesTaillage", position: { x: 258, y: 398 } },
      { id: "conteurs", name: "Conteurs", text: "Ils gardent les gestes utiles en memoire.", cost: { survie: 360, nourriture: 180, savoir: 36 }, scale: 1.2, produces: { savoir: 0.08 }, requires: ["signes"], producerRequires: { tailleursAtelier: 4 }, parent: "tailleursAtelier", position: { x: 482, y: 398 } }
    ],
    nodes: [
      { id: "feu", name: "Feu garde", tag: "Socle", text: "La nuit devient moins totale. La tribu cesse de seulement subir.", cost: { survie: 42, nourriture: 10, evolution: 28 }, position: { x: 390, y: 28 }, effects: { click: { survie: 0.8 }, mult: { survie: 0.12 } } },
      { id: "braises", name: "Braises conservees", tag: "Feu", text: "Le feu dure entre deux nuits. Les actions donnent plus d'evolution.", cost: { survie: 120, nourriture: 36, evolution: 58 }, requires: ["feu"], position: { x: 250, y: 202 }, effects: { click: { evolution: 0.75 }, mult: { evolution: 0.08 } } },
      { id: "outils", name: "Outils tailles", tag: "Technique", text: "Chaque action nourrit mieux la tribu et ouvre la chasse organisee.", cost: { survie: 160, nourriture: 52, pierre: 26, evolution: 64 }, requires: ["feu"], producerRequires: { ramasseursGalets: 3 }, position: { x: 530, y: 202 }, effects: { click: { nourriture: 0.38 }, mult: { nourriture: 0.16 } } },
      { id: "pistes", name: "Pistes de chasse", tag: "Survie", text: "Lire les traces transforme les chasseurs en moteur de survie.", cost: { survie: 420, nourriture: 170, pierre: 90, evolution: 110 }, requires: ["outils"], producerRequires: { tailleursBruts: 4 }, position: { x: 250, y: 376 }, effects: { mult: { survie: 0.22 }, generator: { chasseurs: 0.45 } } },
      { id: "abris", name: "Abris saisonniers", tag: "Camp", text: "La nourriture se perd moins et les couts respirent un peu.", cost: { survie: 520, nourriture: 260, evolution: 130 }, requires: ["braises"], producerRequires: { cueilleurs: 10 }, position: { x: 530, y: 376 }, effects: { mult: { nourriture: 0.2 }, discount: 0.03 } },
      { id: "signes", name: "Signes graves", tag: "Memoire", text: "La tribu laisse des marques. Les premiers savoirs deviennent possibles.", cost: { survie: 900, nourriture: 520, pierre: 180, evolution: 220 }, requires: ["pistes", "abris"], producerRequires: { tablesTaillage: 1 }, position: { x: 390, y: 550 }, effects: { click: { savoir: 0.08 }, mult: { evolution: 0.12 } } },
      { id: "parole", name: "Parole commune", tag: "Langage", text: "Les ordres, mythes et techniques circulent sans etre redecouverts.", cost: { savoir: 18, survie: 1250, evolution: 320 }, requires: ["signes"], position: { x: 250, y: 724 }, effects: { mult: { savoir: 0.32 }, global: 0.03 } },
      { id: "foyer", name: "Foyer des conteurs", tag: "Savoir", text: "Les conteurs transforment la memoire en progression durable.", cost: { savoir: 42, nourriture: 900, pierre: 280, evolution: 480 }, requires: ["signes"], producerRequires: { tailleursAtelier: 3 }, position: { x: 530, y: 724 }, effects: { generator: { conteurs: 0.65 }, click: { savoir: 0.14 } } },
      { id: "rites", name: "Rites de transmission", tag: "Culture", text: "La tribu apprend a reproduire ses propres accelerations.", cost: { savoir: 105, survie: 2400, evolution: 820 }, requires: ["parole", "foyer"], producerRequires: { conteurs: 6 }, position: { x: 390, y: 898 }, effects: { mult: { evolution: 0.22, savoir: 0.18 }, generator: { cueilleurs: 0.4, chasseurs: 0.7, conteurs: 0.35 }, clickAll: 0.08, global: 0.04 } },
      { id: "tribuStable", name: "Tribu stable", tag: "Unlock", text: "La tribu peut rester, semer et batir. Debloque le Neolithique.", cost: { survie: 2200, nourriture: 1500, savoir: 180, evolution: 1200 }, requires: ["rites"], producerRequires: { chasseurs: 10, conteurs: 10 }, position: { x: 390, y: 1072 }, effects: { global: 0.08 } }
    ]
  },
  {
    id: "neolithique",
    name: "Neolithique",
    range: "10 000 - 3 300 av. J.-C.",
    theme: "La survie devient organisation : champs, stockage, villages.",
    actionLabel: "Planifier les recoltes",
    actionText: "Transforme l'effort en nourriture et en population.",
    action: { nourriture: 2, population: 0.03 },
    unlock: { node: "tribuStable", label: "Acheter Tribu stable" },
    generators: [
      { id: "champs", name: "Champs", text: "Une production lente mais fiable.", cost: { nourriture: 260, savoir: 25 }, scale: 1.18, produces: { nourriture: 1.1 } },
      { id: "greniers", name: "Greniers", text: "Le stockage rend les famines moins brutales.", cost: { nourriture: 650, population: 2 }, scale: 1.19, produces: { population: 0.08 } },
      { id: "potiers", name: "Potiers", text: "Les objets standards font circuler les methodes.", cost: { savoir: 80, population: 4 }, scale: 1.2, produces: { savoir: 0.42 } }
    ],
    nodes: [
      { id: "agriculture", name: "Agriculture", tag: "Production", text: "La nourriture gagne un multiplicateur massif.", cost: { nourriture: 520, savoir: 60 }, effects: { mult: { nourriture: 0.55 } } },
      { id: "stockage", name: "Stockage", tag: "Qualite", text: "Les couts des producteurs baissent legerement.", cost: { nourriture: 1300, population: 8 }, requires: ["agriculture"], effects: { discount: 0.06, mult: { population: 0.18 } } },
      { id: "villages", name: "Villages", tag: "Societe", text: "La population amplifie tout ce que la tribu produit.", cost: { population: 18, savoir: 120 }, requires: ["agriculture"], effects: { global: 0.12 } },
      { id: "ecriture", name: "Ecriture primitive", tag: "Unlock", text: "Les comptes, dettes et recits deviennent persistants. Debloque l'Antiquite.", cost: { savoir: 360, population: 32, nourriture: 2400 }, requires: ["stockage", "villages"], effects: { mult: { savoir: 0.35 }, global: 0.08 } }
    ]
  },
  {
    id: "antiquite",
    name: "Antiquite",
    range: "3 300 av. J.-C. - 476",
    theme: "Le savoir devient pouvoir : routes, commerce, cites et empires.",
    actionLabel: "Administrer la cite",
    actionText: "Cree influence, savoir et commerce.",
    action: { influence: 1, savoir: 0.35 },
    unlock: { node: "ecriture", label: "Acheter Ecriture primitive" },
    generators: [
      { id: "scribes", name: "Scribes", text: "Ils transforment les ressources en savoir durable.", cost: { savoir: 460, population: 28 }, scale: 1.18, produces: { savoir: 2.1, influence: 0.22 } },
      { id: "marchands", name: "Marchands", text: "Les routes font circuler influence et richesse.", cost: { influence: 120, nourriture: 4200 }, scale: 1.19, produces: { influence: 1.4 } },
      { id: "architectes", name: "Architectes", text: "Les monuments organisent l'espace et la memoire.", cost: { influence: 620, savoir: 900 }, scale: 1.21, produces: { artisanat: 0.55 } }
    ],
    nodes: [
      { id: "lois", name: "Codes de lois", tag: "Ordre", text: "Les ressources sociales produisent mieux ensemble.", cost: { influence: 300, savoir: 700 }, effects: { mult: { influence: 0.45 }, global: 0.05 } },
      { id: "routes", name: "Routes imperiales", tag: "Reseau", text: "Les producteurs d'influence deviennent beaucoup plus efficaces.", cost: { influence: 1200, artisanat: 110 }, requires: ["lois"], effects: { generator: { marchands: 0.85 }, mult: { influence: 0.25 } } },
      { id: "academie", name: "Academies", tag: "Savoir", text: "Le savoir gagne un role central dans la suite.", cost: { savoir: 2600, influence: 1800 }, requires: ["lois"], effects: { mult: { savoir: 0.8 }, click: { savoir: 1.5 } } },
      { id: "chartes", name: "Chartes urbaines", tag: "Unlock", text: "Les villes peuvent s'autogouverner. Debloque le Moyen Age.", cost: { influence: 5200, artisanat: 420, savoir: 4200 }, requires: ["routes", "academie"], effects: { global: 0.16 } }
    ]
  },
  {
    id: "moyenage",
    name: "Moyen Age",
    range: "476 - 1450",
    theme: "Guildes, foi, forteresses et transmission lente.",
    actionLabel: "Organiser une guilde",
    actionText: "Produit artisanat et influence.",
    action: { artisanat: 2, influence: 0.5 },
    unlock: { node: "chartes", label: "Acheter Chartes urbaines" },
    generators: [
      { id: "guildes", name: "Guildes", text: "Elles rendent les metiers reproductibles.", cost: { artisanat: 580, influence: 2200 }, scale: 1.2, produces: { artisanat: 3.4 } },
      { id: "scriptoriums", name: "Scriptoriums", text: "Ils copient lentement le savoir.", cost: { savoir: 6200, artisanat: 900 }, scale: 1.22, produces: { savoir: 5.5 } },
      { id: "foires", name: "Foires", text: "Le commerce revient par cycles.", cost: { influence: 9600, population: 72 }, scale: 1.21, produces: { influence: 6.2 } }
    ],
    nodes: [
      { id: "moulins", name: "Moulins", tag: "Mecanique", text: "Une premiere automatisation diffuse.", cost: { artisanat: 1800, savoir: 8600 }, effects: { global: 0.14, mult: { artisanat: 0.35 } } },
      { id: "universites", name: "Universites", tag: "Savoir", text: "Les savoirs se contredisent puis s'affinent.", cost: { savoir: 16000, influence: 12000 }, requires: ["moulins"], effects: { mult: { savoir: 0.7 }, click: { savoir: 3 } } },
      { id: "banques", name: "Banques marchandes", tag: "Systeme", text: "Les prix de long terme deviennent plus faciles a absorber.", cost: { influence: 26000, artisanat: 5200 }, requires: ["moulins"], effects: { discount: 0.08, mult: { influence: 0.35 } } },
      { id: "imprimerie", name: "Imprimerie", tag: "Unlock", text: "Les idees peuvent enfin se multiplier. Debloque la Renaissance.", cost: { savoir: 64000, artisanat: 14000, influence: 42000 }, requires: ["universites", "banques"], effects: { global: 0.18, click: { idees: 1 } } }
    ]
  },
  {
    id: "renaissance",
    name: "Renaissance",
    range: "1450 - 1760",
    theme: "Exploration, experimentation, imprimerie et methode scientifique.",
    actionLabel: "Mener une experience",
    actionText: "Produit des idees et de la recherche.",
    action: { idees: 2.2, recherche: 0.15 },
    unlock: { node: "imprimerie", label: "Acheter Imprimerie" },
    generators: [
      { id: "ateliers", name: "Ateliers savants", text: "Ils transforment artisanat en idees.", cost: { idees: 500, artisanat: 24000 }, scale: 1.19, produces: { idees: 3.5 } },
      { id: "cartographes", name: "Cartographes", text: "Ils ouvrent les reseaux et les risques.", cost: { idees: 1800, influence: 90000 }, scale: 1.21, produces: { influence: 18, recherche: 0.65 } },
      { id: "laboratoires", name: "Laboratoires", text: "La recherche devient une ressource autonome.", cost: { recherche: 120, savoir: 140000 }, scale: 1.22, produces: { recherche: 1.8 } }
    ],
    nodes: [
      { id: "methode", name: "Methode scientifique", tag: "Regle", text: "La recherche multiplie toutes les ressources anciennes.", cost: { recherche: 420, idees: 5200 }, effects: { global: 0.22, mult: { recherche: 0.55 } } },
      { id: "navigation", name: "Navigation globale", tag: "Reseau", text: "Influence et idees s'entrelacent.", cost: { idees: 14000, influence: 260000 }, requires: ["methode"], effects: { mult: { influence: 0.55, idees: 0.45 } } },
      { id: "manufactures", name: "Manufactures", tag: "Transition", text: "Les ateliers preparent le choc industriel.", cost: { artisanat: 90000, recherche: 2200 }, requires: ["methode"], effects: { click: { production: 1 }, mult: { artisanat: 0.5 } } },
      { id: "vapeur", name: "Vapeur controlee", tag: "Unlock", text: "La puissance mecanique sort des ateliers. Debloque l'Industrie.", cost: { recherche: 6200, production: 1600, idees: 45000 }, requires: ["navigation", "manufactures"], effects: { global: 0.24 } }
    ]
  },
  {
    id: "industrie",
    name: "Revolution industrielle",
    range: "1760 - 1914",
    theme: "Machines, charbon, usines, vitesse et cout social.",
    actionLabel: "Lancer les machines",
    actionText: "Produit energie et production.",
    action: { energie: 2, production: 3 },
    unlock: { node: "vapeur", label: "Acheter Vapeur controlee" },
    generators: [
      { id: "mines", name: "Mines", text: "L'energie devient massive.", cost: { energie: 600, production: 1800 }, scale: 1.2, produces: { energie: 8 } },
      { id: "usines", name: "Usines", text: "La production change d'echelle.", cost: { production: 6500, energie: 2100 }, scale: 1.21, produces: { production: 18 } },
      { id: "cheminsFer", name: "Chemins de fer", text: "Les ressources circulent a l'echelle du continent.", cost: { production: 34000, influence: 800000 }, scale: 1.22, produces: { influence: 80, production: 12 } }
    ],
    nodes: [
      { id: "standardisation", name: "Standardisation", tag: "Echelle", text: "La production devient repetable.", cost: { production: 18000, energie: 8000 }, effects: { mult: { production: 0.8 }, global: 0.08 } },
      { id: "electricite", name: "Electricite", tag: "Unlock", text: "Une nouvelle infrastructure arrive.", cost: { energie: 52000, recherche: 16000 }, requires: ["standardisation"], effects: { click: { recherche: 4 }, mult: { energie: 0.45 } } },
      { id: "laboratoirePublic", name: "Laboratoires publics", tag: "Recherche", text: "La recherche se met a l'echelle des nations.", cost: { recherche: 52000, production: 220000 }, requires: ["electricite"], effects: { mult: { recherche: 0.9 }, global: 0.16 } },
      { id: "reseauElectrique", name: "Reseau electrique", tag: "Unlock", text: "La modernite commence. Debloque l'Ere moderne.", cost: { energie: 240000, production: 620000, recherche: 120000 }, requires: ["laboratoirePublic"], effects: { global: 0.26 } }
    ]
  },
  {
    id: "moderne",
    name: "Ere moderne",
    range: "1914 - 1970",
    theme: "Electricite, medecine, organisation globale et science rapide.",
    actionLabel: "Coordonner les laboratoires",
    actionText: "Produit recherche et energie.",
    action: { recherche: 8, energie: 4 },
    unlock: { node: "reseauElectrique", label: "Acheter Reseau electrique" },
    generators: [
      { id: "centrales", name: "Centrales", text: "L'energie devient systemique.", cost: { energie: 380000, production: 700000 }, scale: 1.2, produces: { energie: 85 } },
      { id: "universitesModernes", name: "Universites modernes", text: "La recherche forme ses propres producteurs.", cost: { recherche: 180000, influence: 1800000 }, scale: 1.21, produces: { recherche: 42 } }
    ],
    nodes: [
      { id: "medecine", name: "Medecine de masse", tag: "Population", text: "La population soutient mieux la progression.", cost: { recherche: 420000, population: 240 }, effects: { mult: { population: 1.1 }, global: 0.12 } },
      { id: "transistor", name: "Transistor", tag: "Unlock", text: "La miniaturisation ouvre l'Ere numerique.", cost: { recherche: 1400000, energie: 900000 }, requires: ["medecine"], effects: { click: { donnees: 1 }, global: 0.22 } }
    ]
  },
  {
    id: "numerique",
    name: "Ere numerique",
    range: "1970 - 2050",
    theme: "Donnees, calcul, reseaux et automatisation.",
    actionLabel: "Compiler les donnees",
    actionText: "Produit donnees et calcul.",
    action: { donnees: 5, calcul: 1 },
    unlock: { node: "transistor", label: "Acheter Transistor" },
    generators: [
      { id: "serveurs", name: "Serveurs", text: "Les donnees deviennent une mine.", cost: { donnees: 600, energie: 1600000 }, scale: 1.2, produces: { donnees: 22 } },
      { id: "algorithmes", name: "Algorithmes", text: "Le calcul optimise les anciennes chaines.", cost: { calcul: 180, donnees: 2400 }, scale: 1.22, produces: { calcul: 4.4 } }
    ],
    nodes: [
      { id: "internet", name: "Internet", tag: "Reseau", text: "Les savoirs deviennent immediats.", cost: { donnees: 8500, calcul: 900 }, effects: { global: 0.25, mult: { donnees: 0.8 } } },
      { id: "orbite", name: "Infrastructure orbitale", tag: "Unlock", text: "La civilisation sort de son berceau.", cost: { calcul: 5400, energie: 4500000, recherche: 2200000 }, requires: ["internet"], effects: { click: { colonies: 0.15 }, global: 0.22 } }
    ]
  },
  {
    id: "spatial",
    name: "Ere spatiale",
    range: "2050 - ?",
    theme: "Orbite, colonies, energie solaire et autonomie hors Terre.",
    actionLabel: "Lancer une mission",
    actionText: "Produit colonies et energie.",
    action: { colonies: 0.25, energie: 40 },
    unlock: { node: "orbite", label: "Acheter Infrastructure orbitale" },
    generators: [
      { id: "habitats", name: "Habitats orbitaux", text: "La population devient extraplanetaire.", cost: { colonies: 12, energie: 8000000 }, scale: 1.2, produces: { colonies: 0.8 } },
      { id: "miroirsSolaires", name: "Miroirs solaires", text: "L'energie spatiale change l'echelle.", cost: { colonies: 34, calcul: 16000 }, scale: 1.22, produces: { energie: 600 } }
    ],
    nodes: [
      { id: "biospheres", name: "Biospheres fermees", tag: "Autonomie", text: "Les colonies produisent sans la Terre.", cost: { colonies: 80, recherche: 6200000 }, effects: { mult: { colonies: 1.1 }, global: 0.14 } },
      { id: "iaGenerale", name: "IA generale", tag: "Unlock", text: "La civilisation pense avec ses propres outils.", cost: { calcul: 50000, donnees: 120000, colonies: 220 }, requires: ["biospheres"], effects: { click: { conscience: 0.08 }, global: 0.3 } }
    ]
  },
  {
    id: "futur",
    name: "Futur lointain",
    range: "Apres la singularite",
    theme: "Conscience collective, IA, post-humanite et heritage cosmique.",
    actionLabel: "Synthesiser la conscience",
    actionText: "Produit conscience et heritage potentiel.",
    action: { conscience: 0.2 },
    unlock: { node: "iaGenerale", label: "Acheter IA generale" },
    generators: [
      { id: "espritsDistribues", name: "Esprits distribues", text: "La conscience devient infrastructure.", cost: { conscience: 12, calcul: 120000 }, scale: 1.22, produces: { conscience: 0.65 } }
    ],
    nodes: [
      { id: "singularite", name: "Singularite maitrisee", tag: "Final", text: "La civilisation devient capable de se transmettre hors du temps.", cost: { conscience: 80, colonies: 900 }, effects: { global: 0.5, mult: { conscience: 1.5 } } }
    ]
  }
];

const challengeData = [
  { id: "guerresPuniques", era: "antiquite", name: "Guerres puniques", text: "Les routes commerciales s'effondrent. Influence passive -80%. Gagner 1600 Influence.", goal: { resource: "influence", amount: 1600 }, requires: ["lois"], modifiers: { resource: { influence: 0.2 } }, reward: { mult: { influence: 0.55 } } },
  { id: "criseRepublique", era: "antiquite", name: "Crise de la Republique", text: "Les decisions se figent. Clic divise par deux, mais le passif tient. Gagner 5000 Savoir.", goal: { resource: "savoir", amount: 5000 }, requires: ["academie"], modifiers: { click: 0.5 }, reward: { mult: { savoir: 0.65 }, global: 0.05 } },
  { id: "pesteNoire", era: "moyenage", name: "Peste noire", text: "Les reseaux humains ralentissent. Production globale -60%. Gagner 18000 Artisanat.", goal: { resource: "artisanat", amount: 18000 }, requires: ["moulins"], modifiers: { passive: 0.4, click: 0.75 }, reward: { global: 0.12 } },
  { id: "guerreCentAns", era: "moyenage", name: "Guerre de Cent Ans", text: "Les foires et guildes subissent la guerre. Influence -70%. Gagner 42000 Influence.", goal: { resource: "influence", amount: 42000 }, requires: ["banques"], modifiers: { resource: { influence: 0.3 }, cost: 1.25 }, reward: { mult: { artisanat: 0.45, influence: 0.35 } } },
  { id: "procesGalilee", era: "renaissance", name: "Proces de Galilee", text: "Les idees nouvelles sont freinees. Idees -45% et couts plus hauts. Gagner 1800 Recherche.", goal: { resource: "recherche", amount: 1800 }, requires: ["methode"], modifiers: { cost: 1.55, resource: { idees: 0.55 } }, reward: { mult: { recherche: 0.7, idees: 0.4 } } },
  { id: "longitudesPerdues", era: "renaissance", name: "Longitudes perdues", text: "La navigation manque de precision. Influence -60%. Gagner 16000 Idees.", goal: { resource: "idees", amount: 16000 }, requires: ["navigation"], modifiers: { resource: { influence: 0.4 } }, reward: { mult: { influence: 0.45, idees: 0.35 } } },
  { id: "smogLondres", era: "industrie", name: "Grand smog industriel", text: "Energie -70%, production intacte. Gagner 120000 Production.", goal: { resource: "production", amount: 120000 }, requires: ["standardisation"], modifiers: { resource: { energie: 0.3 } }, reward: { mult: { production: 0.75 }, global: 0.06 } },
  { id: "criseCharbon", era: "industrie", name: "Crise du charbon", text: "L'energie coute cher. Couts +60% et energie -50%. Gagner 90000 Energie.", goal: { resource: "energie", amount: 90000 }, requires: ["electricite"], modifiers: { cost: 1.6, resource: { energie: 0.5 } }, reward: { mult: { energie: 0.75 }, discount: 0.04 } },
  { id: "blackout1977", era: "moderne", name: "Blackout de 1977", text: "Passif -50% et energie -80%. Gagner 220000 Recherche.", goal: { resource: "recherche", amount: 220000 }, requires: ["medecine"], modifiers: { passive: 0.5, resource: { energie: 0.2 } }, reward: { mult: { energie: 0.9, recherche: 0.35 } } },
  { id: "courseAtomique", era: "moderne", name: "Course atomique", text: "La recherche avance sous contrainte. Couts +50%, mais clic recherche +25%. Gagner 900000 Recherche.", goal: { resource: "recherche", amount: 900000 }, requires: ["transistor"], modifiers: { cost: 1.5, click: 1.25 }, reward: { mult: { recherche: 0.8 }, global: 0.06 } },
  { id: "bugAn2000", era: "numerique", name: "Bug de l'an 2000", text: "Donnees -65%. Gagner 12000 Calcul.", goal: { resource: "calcul", amount: 12000 }, requires: ["internet"], modifiers: { resource: { donnees: 0.35 } }, reward: { mult: { donnees: 0.9, calcul: 0.65 } } },
  { id: "tempeteSolaire", era: "spatial", name: "Tempete solaire", text: "La Terre n'aide presque plus. Gagner 120 Colonies.", goal: { resource: "colonies", amount: 120 }, requires: ["biospheres"], modifiers: { passive: 0.35, click: 1.25 }, reward: { mult: { colonies: 1.1 }, global: 0.08 } }
];

const upgradeTreePositions = [
  { x: 390, y: 28 },
  { x: 390, y: 210 },
  { x: 390, y: 392 },
  { x: 390, y: 574 },
  { x: 390, y: 756 },
  { x: 390, y: 938 }
];

const challengeTreePositions = [
  { x: 665, y: 210 },
  { x: 115, y: 392 },
  { x: 665, y: 574 }
];

const eraPacing = {
  prehistoire: {
    actionEvolution: 1.45,
    passiveEvolution: 0.05,
    producerEvolutionCost: 0.8,
    nodeEvolutionCost: 1.1,
    challengeEvolutionCost: 2.8
  }
};

const milestoneData = [
  { id: "m1", era: "prehistoire", name: "Premier camp", text: "Atteindre 100 Points d'evolution.", condition: (s) => s.resources.evolution >= 100, reward: { click: { evolution: 1, survie: 1 } } },
  { id: "m2", era: "prehistoire", name: "Feu partage", text: "Acheter Feu garde.", condition: () => hasNode("feu"), reward: { mult: { savoir: 0.25 } } },
  { id: "m3", era: "prehistoire", name: "Memoire orale", text: "Avoir 3 nodes de Prehistoire.", condition: () => eraNodeCount("prehistoire") >= 3, reward: { global: 0.06 } },
  { id: "m25", era: "prehistoire", name: "Cueillette organisee", text: "Posseder 5 Cueilleurs.", condition: () => (state.producers.cueilleurs || 0) >= 5, reward: { mult: { nourriture: 0.18 } } },
  { id: "m26", era: "prehistoire", name: "Pistes de chasse", text: "Posseder 5 Chasseurs.", condition: () => (state.producers.chasseurs || 0) >= 5, reward: { mult: { survie: 0.18 } } },
  { id: "m27", era: "prehistoire", name: "Recits du foyer", text: "Posseder 5 Conteurs.", condition: () => (state.producers.conteurs || 0) >= 5, reward: { mult: { savoir: 0.22 } } },
  { id: "m28", era: "prehistoire", name: "Chemins connus", text: "Avoir 6 nodes de Prehistoire.", condition: () => eraNodeCount("prehistoire") >= 6, reward: { global: 0.08, clickAll: 0.12 } },
  { id: "m29", era: "prehistoire", name: "Camp nourri", text: "Posseder 10 Cueilleurs.", condition: () => (state.producers.cueilleurs || 0) >= 10, reward: { click: { nourriture: 0.5 }, mult: { nourriture: 0.3 } } },
  { id: "m30", era: "prehistoire", name: "Chasse rythmee", text: "Posseder 10 Chasseurs.", condition: () => (state.producers.chasseurs || 0) >= 10, reward: { click: { survie: 1.2 }, mult: { survie: 0.32 } } },
  { id: "m31", era: "prehistoire", name: "Mythes communs", text: "Avoir 8 nodes de Prehistoire.", condition: () => eraNodeCount("prehistoire") >= 8, reward: { global: 0.08, mult: { evolution: 0.18 } } },
  { id: "m32", era: "prehistoire", name: "Memoire vivante", text: "Atteindre 150 Savoir.", condition: (s) => s.resources.savoir >= 150, reward: { click: { savoir: 0.18 }, mult: { savoir: 0.35 } } },
  { id: "m4", era: "neolithique", name: "Premiers champs", text: "Debloquer le Neolithique.", condition: () => isEraUnlocked("neolithique"), reward: { click: { nourriture: 1 } } },
  { id: "m5", era: "neolithique", name: "Village vivant", text: "Atteindre 20 Population.", condition: (s) => s.resources.population >= 20, reward: { mult: { population: 0.3 } } },
  { id: "m6", era: "neolithique", name: "Greniers pleins", text: "Posseder 10 producteurs neolithiques.", condition: () => eraProducerCount("neolithique") >= 10, reward: { discount: 0.03 } },
  { id: "m7", era: "antiquite", name: "Cite ecrite", text: "Debloquer l'Antiquite.", condition: () => isEraUnlocked("antiquite"), reward: { click: { influence: 1 } } },
  { id: "m8", era: "antiquite", name: "Routes actives", text: "Acheter Routes imperiales.", condition: () => hasNode("routes"), reward: { mult: { influence: 0.3 } } },
  { id: "m9", era: "antiquite", name: "Deux defis antiques", text: "Completer 2 challenges.", condition: (s) => s.completedChallenges.length >= 2, reward: { global: 0.1 } },
  { id: "m10", era: "moyenage", name: "Villes libres", text: "Debloquer le Moyen Age.", condition: () => isEraUnlocked("moyenage"), reward: { mult: { artisanat: 0.45 } } },
  { id: "m11", era: "moyenage", name: "Savoirs copies", text: "Atteindre 100000 Savoir.", condition: (s) => s.resources.savoir >= 100000, reward: { mult: { savoir: 0.35 } } },
  { id: "m12", era: "renaissance", name: "Idees imprimees", text: "Debloquer la Renaissance.", condition: () => isEraUnlocked("renaissance"), reward: { click: { idees: 2 }, mult: { idees: 0.35 } } },
  { id: "m13", era: "renaissance", name: "Methode robuste", text: "Acheter Methode scientifique.", condition: () => hasNode("methode"), reward: { mult: { recherche: 0.35 } } },
  { id: "m14", era: "industrie", name: "Usines en marche", text: "Debloquer l'Industrie.", condition: () => isEraUnlocked("industrie"), reward: { click: { production: 4, energie: 2 } } },
  { id: "m15", era: "industrie", name: "Quatre crises", text: "Completer 4 challenges.", condition: (s) => s.completedChallenges.length >= 4, reward: { global: 0.16 } },
  { id: "m16", era: "moderne", name: "Reseau mondial", text: "Debloquer l'Ere moderne.", condition: () => isEraUnlocked("moderne"), reward: { mult: { energie: 0.5, recherche: 0.3 } } },
  { id: "m17", era: "numerique", name: "Tout devient donnees", text: "Debloquer l'Ere numerique.", condition: () => isEraUnlocked("numerique"), reward: { click: { donnees: 3 }, mult: { donnees: 0.5 } } },
  { id: "m18", era: "spatial", name: "Hors berceau", text: "Debloquer l'Ere spatiale.", condition: () => isEraUnlocked("spatial"), reward: { global: 0.24 } },
  { id: "m19", era: "futur", name: "Nouvelle espece", text: "Debloquer le Futur lointain.", condition: () => isEraUnlocked("futur"), reward: { mult: { conscience: 1 } } },
  { id: "m20", era: "global", name: "Arbre dense", text: "Acheter 20 nodes.", condition: () => state.nodes.length >= 20, reward: { global: 0.25 } },
  { id: "m21", era: "global", name: "Dix producteurs", text: "Posseder 10 producteurs.", condition: () => totalProducers() >= 10, reward: { global: 0.08 } },
  { id: "m22", era: "global", name: "Cinquante producteurs", text: "Posseder 50 producteurs.", condition: () => totalProducers() >= 50, reward: { discount: 0.05, global: 0.08 } },
  { id: "m23", era: "global", name: "Historien tenace", text: "Jouer 250 actions manuelles.", condition: (s) => s.totalActions >= 250, reward: { clickAll: 0.3 } },
  { id: "m24", era: "global", name: "Heritage vivant", text: "Obtenir 1 Heritage.", condition: (s) => s.resources.heritage >= 1, reward: { global: 0.2 } }
];

const layouts = [
  { id: "thread", title: "Fil", subtitle: "Arbre et metiers", icon: "F" },
  { id: "challenges", title: "Challenges", subtitle: "Epreuves", icon: "C" },
  { id: "milestones", title: "Milestones", subtitle: "Paliers", icon: "M" },
  { id: "transmission", title: "Transmission", subtitle: "Prestige", icon: "T" },
  { id: "archive", title: "Archive", subtitle: "Journal", icon: "A" }
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
  resetSave: document.querySelector("#resetSave")
};

let state = loadState();
let lastFrame = performance.now();
let lastFullRender = performance.now();

render();
requestAnimationFrame(tick);
setInterval(saveGame, 5000);

elements.exportSave.addEventListener("click", () => {
  elements.dialogTitle.textContent = "Exporter";
  elements.savePayload.value = btoa(JSON.stringify(state));
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
  setStatus("Sauvegarde copiee");
});

elements.loadSave.addEventListener("click", () => {
  try {
    state = normalizeState(JSON.parse(atob(elements.savePayload.value.trim())));
    elements.saveDialog.close();
    saveGame();
    render();
    setStatus("Sauvegarde importee");
  } catch {
    setStatus("Import impossible");
  }
});

elements.resetSave.addEventListener("click", () => {
  if (!window.confirm("Repartir de zero sur cette sauvegarde locale ?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = createState();
  render();
  saveGame();
});

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

function tick(now) {
  const delta = Math.min((now - lastFrame) / 1000, 1);
  lastFrame = now;
  const production = productionPerSecond();
  Object.entries(production).forEach(([resource, amount]) => {
    addResource(resource, amount * delta);
  });
  const unlockedMilestone = checkMilestones();
  if (unlockedMilestone || now - lastFullRender > 1000) {
    lastFullRender = now;
    render();
  } else {
    renderQuick();
  }
  requestAnimationFrame(tick);
}

function render() {
  ensureActiveEra();
  checkMilestones();
  renderNav();
  renderQuick();
  const renderers = {
    thread: renderThread,
    challenges: renderChallenges,
    milestones: renderMilestones,
    transmission: renderTransmission,
    archive: renderArchive
  };
  elements.stage.innerHTML = renderers[state.activeLayout]();
  wireStage();
}

function renderQuick() {
  renderResources();
  renderSideStatus();
}

function renderNav() {
  elements.nav.innerHTML = "";
  layouts.forEach((layout) => {
    const button = document.createElement("button");
    button.className = `nav-button${state.activeLayout === layout.id ? " active" : ""}`;
    button.type = "button";
    const count = layout.id === "challenges" ? state.completedChallenges.length : layout.id === "milestones" ? state.milestones.length : "";
    button.innerHTML = `
      <span class="nav-icon">${layout.icon}</span>
      <span class="nav-text">
        <span class="nav-title">${layout.title}</span>
        <span class="nav-subtitle">${layout.subtitle}</span>
      </span>
      <span class="${count === "" ? "lock-dot" : "count-dot"}">${count === "" ? "" : count}</span>
    `;
    button.addEventListener("click", () => {
      state.activeLayout = layout.id;
      render();
    });
    elements.nav.append(button);
  });
}

function renderResources() {
  const visible = Object.keys(resourceMeta).filter((resource) => isResourceVisible(resource));
  elements.resourceStrip.innerHTML = visible.map((resource) => {
    const rate = productionPerSecond()[resource] || 0;
    return `
      <div class="resource-pill">
        <small>${resourceMeta[resource].label}${rate ? ` / sec ${format(rate)}` : ""}</small>
        <strong>${format(state.resources[resource])}</strong>
      </div>
    `;
  }).join("");
}

function renderSideStatus() {
  const era = getEra(state.activeEra);
  elements.activeEraName.textContent = era.name;
  elements.activeEraRange.textContent = era.range;
  if (state.activeChallenge) {
    const challenge = getChallenge(state.activeChallenge.id);
    const progress = challengeProgress(challenge);
    elements.activeChallengeName.textContent = challenge.name;
    elements.activeChallengeInfo.textContent = `${Math.round(progress * 100)}% - ${resourceMeta[challenge.goal.resource].label}`;
  } else {
    elements.activeChallengeName.textContent = "Aucun";
    elements.activeChallengeInfo.textContent = "Progression libre";
  }
}

function renderThread() {
  const era = getEra(state.activeEra);
  const threadNodes = visibleThreadNodes(era.id);
  const producerNodes = visibleProducerNodes(era.id);
  const totalEraNodes = getThreadNodes(era.id).length;
  const totalEraProducers = getProducerTreeNodes(era.id).length;
  const treeHeight = Math.max(430, Math.max(...threadNodes.map((node) => node.y)) + 190);
  const producerHeight = Math.max(430, Math.max(...producerNodes.map((producer) => producer.y)) + 190);
  const gains = clickGains(era);
  return `
    <div class="page">
      <header class="page-head">
        <div>
          <p class="kicker">Fil conducteur</p>
          <h2>${era.name}</h2>
          <p>${era.theme}</p>
        </div>
        <div class="head-meter">
          <div class="meter-label"><span>Arbre actif</span><strong>${threadNodeCount(era.id)} / ${totalEraNodes}</strong></div>
          <div class="progress"><span style="--progress:${percentage(threadNodeCount(era.id), totalEraNodes)}%"></span></div>
        </div>
      </header>
      <div class="era-switcher">
        ${visibleEraTabs().map(renderEraSwitch).join("")}
      </div>
      <div class="play-grid">
        <section class="command-column">
          <div class="action-card">
            <div>
              <p class="kicker">Action</p>
              <h3>${era.actionLabel}</h3>
              <p>${era.actionText}</p>
            </div>
            <button class="action-button" type="button" data-action-era="${era.id}">${era.actionLabel}</button>
            <div class="gain-list">
              ${Object.entries(gains).map(([resource, amount]) => `<div class="gain-line"><span>${resourceMeta[resource].label}</span><strong>+${format(amount)}</strong></div>`).join("")}
            </div>
          </div>
          <div class="tree-section-head">
            <div>
              <p class="kicker">Metiers et production</p>
              <h3>Arbre des ressources</h3>
            </div>
            <strong>${producerTreeCount(era.id)} / ${totalEraProducers}</strong>
          </div>
          <div class="producer-tree-board" style="--producer-tree-height:${producerHeight}px">
            ${renderProducerTreeLinks(producerNodes, producerHeight)}
            ${producerNodes.map(renderProducerNode).join("")}
          </div>
        </section>
        <section class="history-column">
          <div class="tree-section-head">
            <div>
              <p class="kicker">Civilisation</p>
              <h3>Fil historique</h3>
            </div>
            <strong>${threadNodeCount(era.id)} / ${totalEraNodes}</strong>
          </div>
          <div class="tree-board" style="--tree-height:${treeHeight}px">
            ${renderTreeLinks(threadNodes, treeHeight)}
            ${threadNodes.map(renderTreeNode).join("")}
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
    <button class="era-tab ${current ? "active" : ""}" type="button" data-era="${era.id}" ${unlocked ? "" : "disabled"}>
      <strong>${era.name}</strong>
      <span>${unlocked ? `${threadNodeCount(era.id)} nodes` : era.unlock.label}</span>
    </button>
  `;
}

function visibleEraTabs() {
  const unlocked = unlockedEras();
  const next = eraData.find((era) => !isEraUnlocked(era.id));
  return next ? [...unlocked, next] : unlocked;
}

function renderTreeNode(node) {
  const bought = hasNode(node.id);
  const available = nodeAvailable(node);
  const challenge = node.kind === "challenge" ? getChallenge(node.challengeId) : null;
  const completed = challenge ? state.completedChallenges.includes(challenge.id) : false;
  const label = bought
    ? challenge ? completed ? "Complete" : "Debloque" : "Acquis"
    : available ? "Debloquer" : "Verrouille";
  return `
    <article class="tree-node ${node.kind === "challenge" ? "challenge" : "upgrade"} ${bought ? "bought" : ""} ${available ? "" : "locked"} ${completed ? "done" : ""}" style="left:${node.x}px; top:${node.y}px">
      <span class="node-tag">${node.tag}</span>
      <h3>${node.name}</h3>
      <p>${node.text}</p>
      <div class="cost-line">${bought ? (challenge ? "Challenge disponible dans le layout Challenges" : "Bonus actif") : available ? formatCost(nodeCost(node)) : requirementText(node)}</div>
      <button class="node-button" type="button" data-buy-node="${node.id}" ${bought || !available || !canPay(nodeCost(node)) ? "disabled" : ""}>${label}</button>
    </article>
  `;
}

function renderTreeLinks(nodes, treeHeight) {
  const links = [];
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
  nodes.forEach((node) => {
    (node.requires || []).forEach((requiredId) => {
      const parent = byId[requiredId];
      if (!parent) return;
      links.push(`<path d="${treeConnectorPath(parent, node)}"></path>`);
    });
  });
  return `<svg class="tree-links" viewBox="0 0 980 ${treeHeight}" aria-hidden="true">${links.join("")}</svg>`;
}

function renderProducerTreeLinks(producers, treeHeight) {
  const links = [];
  const byId = Object.fromEntries(producers.map((producer) => [producer.id, producer]));
  producers.forEach((producer) => {
    if (!producer.parent) return;
    const parent = byId[producer.parent];
    if (!parent) return;
    links.push(`<path d="${treeConnectorPath(parent, producer)}"></path>`);
  });
  return `<svg class="tree-links producer-tree-links" viewBox="0 0 700 ${treeHeight}" aria-hidden="true">${links.join("")}</svg>`;
}

function treeConnectorPath(parent, node) {
  const parentX = parent.x + 90;
  const parentY = parent.y + 142;
  const nodeX = node.x + 90;
  const nodeY = node.y;
  if (Math.abs(parentX - nodeX) < 20) {
    return `M ${parentX} ${parentY} L ${nodeX} ${nodeY}`;
  }
  const midY = parentY + Math.max(24, (nodeY - parentY) * 0.45);
  return `M ${parentX} ${parentY} C ${parentX} ${midY}, ${nodeX} ${midY}, ${nodeX} ${nodeY}`;
}

function renderEra() {
  const era = getEra(state.activeEra);
  const gains = clickGains(era);
  const progress = percentage(eraNodeCount(era.id), era.nodes.length);
  return `
    <div class="page">
      <header class="page-head">
        <div>
          <p class="kicker">Layout epoque</p>
          <h2>${era.name}</h2>
          <p>${era.theme}</p>
        </div>
        <div class="head-meter">
          <div class="meter-label"><span>Nodes</span><strong>${eraNodeCount(era.id)} / ${era.nodes.length}</strong></div>
          <div class="progress"><span style="--progress:${progress}%"></span></div>
        </div>
      </header>
      <div class="two-column">
        <div class="panel">
          <div class="panel-head">
            <div>
              <p class="kicker">Interaction</p>
              <h3>${era.actionLabel}</h3>
              <p>${era.actionText}</p>
            </div>
          </div>
          <div class="action-card">
            <button class="action-button" type="button" data-action-era="${era.id}">${era.actionLabel}</button>
            <div class="gain-list">
              ${Object.entries(gains).map(([resource, amount]) => `<div class="gain-line"><span>${resourceMeta[resource].label}</span><strong>+${format(amount)}</strong></div>`).join("")}
            </div>
          </div>
          <div class="panel-head" style="margin-top:16px">
            <div>
              <p class="kicker">Producteurs</p>
              <h3>Infrastructure</h3>
            </div>
          </div>
          <div class="stack">${era.generators.map(renderProducer).join("")}</div>
        </div>
        <div class="node-map">
          ${era.nodes.map((node) => renderNode(node)).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderProducer(producer) {
  const owned = state.producers[producer.id] || 0;
  const locked = !producerAvailable(producer);
  const cost = producerCost(producer);
  const nextBulkAt = (Math.floor(owned / 10) + 1) * 10;
  return `
    <article class="producer-card">
      <div>
        <h3>${producer.name} x${owned}</h3>
        <p>${producer.text}</p>
        <p>${formatProduces(producerProduces(producer))}</p>
        <p>Palier x${format(producerBulkBonus(producer))} - prochain a ${nextBulkAt}</p>
        <div class="cost-line">${locked ? producerRequirementText(producer) : formatCost(cost)}</div>
      </div>
      <button class="buy-button" type="button" data-buy-producer="${producer.id}" ${locked || !canPay(cost) ? "disabled" : ""}>Acheter</button>
    </article>
  `;
}

function renderProducerNode(producer) {
  const owned = state.producers[producer.id] || 0;
  const available = producerAvailable(producer);
  const cost = producerCost(producer);
  const nextBulkAt = (Math.floor(owned / 10) + 1) * 10;
  return `
    <article class="tree-node producer-node ${owned ? "bought" : ""} ${available ? "" : "locked"}" style="left:${producer.x}px; top:${producer.y}px">
      <span class="node-tag">${producer.tag || "Metier"}</span>
      <h3>${producer.name} x${owned}</h3>
      <p>${producer.text}</p>
      <p>${formatProduces(producerProduces(producer))}</p>
      <p>Palier x${format(producerBulkBonus(producer))} - prochain a ${nextBulkAt}</p>
      <div class="cost-line">${available ? formatCost(cost) : producerRequirementText(producer)}</div>
      <button class="node-button" type="button" data-buy-producer="${producer.id}" ${!available || !canPay(cost) ? "disabled" : ""}>Acheter</button>
    </article>
  `;
}

function renderNode(node) {
  const bought = hasNode(node.id);
  const locked = !nodeAvailable(node);
  return `
    <article class="node-card ${bought ? "bought" : ""} ${locked && !bought ? "locked" : ""}">
      <span class="node-tag">${node.tag}</span>
      <h3>${node.name}</h3>
      <p>${node.text}</p>
      <div class="cost-line">${bought ? "Acquis" : locked ? requirementText(node) : formatCost(nodeCost(node))}</div>
      <button class="node-button" type="button" data-buy-node="${node.id}" ${bought || locked || !canPay(nodeCost(node)) ? "disabled" : ""}>${bought ? "Acquis" : "Debloquer"}</button>
    </article>
  `;
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
          <p>Chaque challenge modifie les regles. L'objectif se mesure depuis ton entree dans le challenge, puis la recompense reste permanente.</p>
        </div>
        <div class="head-meter">
          <div class="meter-label"><span>Completes</span><strong>${completedVisible} / ${visibleChallenges.length}</strong></div>
          <div class="progress"><span style="--progress:${percentage(completedVisible, visibleChallenges.length)}%"></span></div>
        </div>
      </header>
      ${active ? renderActiveChallenge(active) : ""}
      ${visibleChallenges.length
        ? `<div class="challenge-grid">${visibleChallenges.map(renderChallengeCard).join("")}</div>`
        : `<section class="panel"><h3>Aucune epreuve revelee</h3><p>Les defis historiques commencent avec l'Antiquite.</p></section>`}
    </div>
  `;
}

function renderActiveChallenge(challenge) {
  const progress = challengeProgress(challenge);
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <p class="kicker">Challenge actif</p>
          <h3>${challenge.name}</h3>
          <p>${challenge.text}</p>
        </div>
      </div>
      <div class="progress"><span style="--progress:${Math.round(progress * 100)}%"></span></div>
      <div class="dialog-actions">
        <button class="challenge-button complete" type="button" data-complete-challenge="${challenge.id}" ${progress >= 1 ? "" : "disabled"}>Completer</button>
        <button class="challenge-button" type="button" data-abandon-challenge>Abandonner</button>
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
      <p class="cost-line">Recompense : ${formatEffect(challenge.reward)}</p>
      <div class="progress"><span style="--progress:${Math.round(progress * 100)}%"></span></div>
      <button class="challenge-button" type="button" data-start-challenge="${challenge.id}" ${done || active || locked || state.activeChallenge ? "disabled" : ""}>${done ? "Complete" : active ? "Actif" : locked ? "Verrouille" : "Entrer"}</button>
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
          <p>Les milestones se declenchent automatiquement et ajoutent des bonus permanents. Elles servent de rythme entre les gros unlocks de l'arbre.</p>
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
      <p class="cost-line">${done ? "Actif" : "A venir"} : ${formatEffect(milestone.reward)}</p>
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
          <p>Quand une civilisation a assez marque l'histoire, elle transmet son heritage. Tu repars au debut avec un multiplicateur global durable.</p>
        </div>
        <div class="head-meter">
          <div class="meter-label"><span>Heritage actuel</span><strong>${format(state.resources.heritage)}</strong></div>
          <div class="progress"><span style="--progress:${Math.min(100, state.resources.heritage * 12)}%"></span></div>
        </div>
      </header>
      <section class="transmission-card">
        <p class="kicker">Gain potentiel</p>
        <div class="transmission-value">+${format(gain)}</div>
        <p>${can ? "La transmission est possible. Elle garde tes challenges completes et ton heritage." : "Debloque au moins l'Industrie ou accumule davantage de milestones et de challenges."}</p>
        <div class="stat-list">
          <div class="stat-line"><span>Nodes achetes</span><strong>${state.nodes.length}</strong></div>
          <div class="stat-line"><span>Challenges completes</span><strong>${state.completedChallenges.length}</strong></div>
          <div class="stat-line"><span>Milestones</span><strong>${state.milestones.length}</strong></div>
          <div class="stat-line"><span>Multiplicateur heritage</span><strong>x${format(1 + state.resources.heritage * 0.12)}</strong></div>
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
          <h2>Journal et etat du run</h2>
          <p>Cette page garde les evenements importants, utile pour suivre les unlocks pendant que l'arbre grossit.</p>
        </div>
      </header>
      <div class="two-column">
        <section class="panel">
          <div class="panel-head">
            <div>
              <p class="kicker">Journal</p>
              <h3>Derniers evenements</h3>
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
            <div class="stat-line"><span>Nodes</span><strong>${format(state.nodes.length)}</strong></div>
            <div class="stat-line"><span>Challenges</span><strong>${format(state.completedChallenges.length)}</strong></div>
            <div class="stat-line"><span>Milestones</span><strong>${format(state.milestones.length)}</strong></div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function wireStage() {
  document.querySelectorAll("[data-era]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeEra = button.dataset.era;
      state.activeLayout = "thread";
      render();
    });
  });
  document.querySelectorAll("[data-action-era]").forEach((button) => {
    button.addEventListener("click", () => takeAction(button.dataset.actionEra, button));
  });
  document.querySelectorAll("[data-buy-producer]").forEach((button) => {
    button.addEventListener("click", () => buyProducer(button.dataset.buyProducer));
  });
  document.querySelectorAll("[data-buy-node]").forEach((button) => {
    button.addEventListener("click", () => buyNode(button.dataset.buyNode));
  });
  document.querySelectorAll("[data-start-challenge]").forEach((button) => {
    button.addEventListener("click", () => startChallenge(button.dataset.startChallenge));
  });
  document.querySelectorAll("[data-complete-challenge]").forEach((button) => {
    button.addEventListener("click", () => completeChallenge(button.dataset.completeChallenge));
  });
  const abandon = document.querySelector("[data-abandon-challenge]");
  if (abandon) abandon.addEventListener("click", abandonChallenge);
  const transmit = document.querySelector("[data-transmit]");
  if (transmit) transmit.addEventListener("click", transmitCivilization);
}

function takeAction(eraId, button) {
  const era = getEra(eraId);
  const gains = clickGains(era);
  Object.entries(gains).forEach(([resource, amount]) => addResource(resource, amount));
  state.totalActions += 1;
  button.animate([{ transform: "scale(1)" }, { transform: "scale(0.98)" }, { transform: "scale(1)" }], { duration: 160 });
  checkMilestones();
  render();
}

function buyProducer(id) {
  const producer = getProducer(id);
  if (!producerAvailable(producer)) return;
  const cost = producerCost(producer);
  if (!canPay(cost)) return;
  pay(cost);
  state.producers[id] = (state.producers[id] || 0) + 1;
  addLog(`${producer.name} rejoint ${getEraForProducer(id).name}.`);
  checkMilestones();
  render();
}

function buyNode(id) {
  const node = getNode(id);
  const cost = nodeCost(node);
  if (hasNode(id) || !nodeAvailable(node) || !canPay(cost)) return;
  pay(cost);
  state.nodes.push(id);
  const era = getEraForNode(id);
  addLog(`${node.name} debloque dans ${era.name}.`);
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
  addLog(`Challenge commence : ${challenge.name}.`);
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
  addLog(`Challenge complete : ${challenge.name}.`);
  checkMilestones();
  render();
}

function abandonChallenge() {
  if (!state.activeChallenge) return;
  const challenge = getChallenge(state.activeChallenge.id);
  const backup = state.activeChallenge.backup;
  restoreChallengeState(backup);
  addLog(`Challenge abandonne : ${challenge.name}.`);
  state.activeChallenge = null;
  state.activeEra = challenge.era;
  state.activeLayout = "challenges";
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
  const keptHeritage = state.resources.heritage + heritageGain;
  const keptChallenges = [...state.completedChallenges];
  state = createState();
  state.resources.heritage = keptHeritage;
  state.completedChallenges = keptChallenges;
  addLog(`Transmission accomplie : +${format(heritageGain)} Heritage.`);
  saveGame();
  render();
}

function productionPerSecond() {
  const effects = computedEffects();
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

function producerProduces(producer, effects = computedEffects()) {
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
  const effects = computedEffects();
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

function computedEffects() {
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
  state.nodes.map(getNode).forEach((node) => apply(node.effects));
  state.completedChallenges.map(getChallenge).forEach((challenge) => apply(challenge.reward));
  state.milestones.map(getMilestone).forEach((milestone) => apply(milestone.reward));
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
}

function canPay(cost) {
  return Object.entries(cost).every(([resource, amount]) => state.resources[resource] >= amount);
}

function producerCost(producer) {
  const owned = state.producers[producer.id] || 0;
  const effects = computedEffects();
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

function nodeCost(node) {
  const effects = computedEffects();
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
      unlocked = true;
    }
  });
  return unlocked;
}

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
    return node.effects && node.effects.click && Object.prototype.hasOwnProperty.call(node.effects.click, resource);
  });
}

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
  const upgrades = era.nodes.map((node, index) => ({
    ...node,
    kind: "upgrade",
    ...(node.position || upgradeTreePositions[index] || { x: 390, y: 938 + (index - 5) * 182 })
  }));
  const challengeNodes = challengeData
    .filter((challenge) => challenge.era === eraId)
    .map((challenge, index) => ({
      ...getChallengeUnlockNode(challengeUnlockNodeId(challenge.id)),
      ...(challengeTreePositions[index] || { x: 35 + index * 210, y: 520 })
    }));
  return [...upgrades, ...challengeNodes];
}

function getProducerTreeNodes(eraId) {
  const era = getEra(eraId);
  return era.generators.map((producer, index) => ({
    ...producer,
    kind: "producer",
    tag: producer.tag || "Metier",
    ...(producer.position || { x: 34 + (index % 3) * 224, y: 38 + Math.floor(index / 3) * 180 })
  }));
}

function visibleThreadNodes(eraId) {
  const allNodes = getThreadNodes(eraId);
  return allNodes.filter((node) => {
    if (hasNode(node.id)) return true;
    return nodeRevealed(node);
  });
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
    name: `Epreuve : ${challenge.name}`,
    tag: "Challenge",
    text: `Debloque le challenge "${challenge.name}". ${challenge.text}`,
    cost: challengeUnlockCost(challenge),
    requires: challenge.requires || [],
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

function percentage(value, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function formatCost(cost) {
  return Object.entries(cost).map(([resource, amount]) => `${format(amount)} ${resourceMeta[resource].short}`).join(" | ");
}

function formatProduces(produces) {
  return Object.entries(produces).map(([resource, amount]) => `+${format(amount)} ${resourceMeta[resource].short}/sec`).join(" | ");
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
  return requirements.length ? `Requiert ${requirements.join(" + ")}` : "Verrouille";
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
  return requirements.length ? `Requiert ${requirements.join(" + ")}` : "Verrouille";
}

function formatEffect(effect) {
  const parts = [];
  if (effect.global) parts.push(`global +${Math.round(effect.global * 100)}%`);
  if (effect.discount) parts.push(`couts -${Math.round(effect.discount * 100)}%`);
  if (effect.clickAll) parts.push(`clics +${Math.round(effect.clickAll * 100)}%`);
  Object.entries(effect.mult || {}).forEach(([resource, amount]) => parts.push(`${resourceMeta[resource].label} +${Math.round(amount * 100)}%`));
  Object.entries(effect.click || {}).forEach(([resource, amount]) => parts.push(`clic ${resourceMeta[resource].label} +${format(amount)}`));
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
    elements.saveStatus.textContent = "Sauvegarde prete";
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
