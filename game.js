const STORAGE_KEY = "atelier-stellaire-save-v1";

const buildings = [
  {
    id: "collector",
    name: "Collecteur",
    icon: "C",
    baseCost: 15,
    rate: 0.2,
    scale: 1.15,
    text: "Capte la poussiere brillante."
  },
  {
    id: "coil",
    name: "Bobine",
    icon: "B",
    baseCost: 120,
    rate: 1.4,
    scale: 1.17,
    text: "Concentre les decharges du noyau."
  },
  {
    id: "foundry",
    name: "Fonderie",
    icon: "F",
    baseCost: 950,
    rate: 8.5,
    scale: 1.18,
    text: "Moule les etincelles en barres stables."
  },
  {
    id: "observatory",
    name: "Observatoire",
    icon: "O",
    baseCost: 7200,
    rate: 46,
    scale: 1.19,
    text: "Aligne les relais avec les constellations."
  }
];

const upgrades = [
  {
    id: "warmHands",
    name: "Mains chargees",
    cost: 60,
    text: "+1 etincelle par pression",
    apply(state) {
      state.clickBonus += 1;
    }
  },
  {
    id: "quickPulse",
    name: "Impulsion nette",
    cost: 280,
    text: "Production globale +25%",
    apply(state) {
      state.globalMultiplier += 0.25;
    }
  },
  {
    id: "fineMagnets",
    name: "Aimants fins",
    cost: 760,
    text: "Collecteurs deux fois plus efficaces",
    apply(state) {
      state.buildingMultipliers.collector *= 2;
    }
  },
  {
    id: "silentCoils",
    name: "Bobines silencieuses",
    cost: 2400,
    text: "Bobines deux fois plus efficaces",
    apply(state) {
      state.buildingMultipliers.coil *= 2;
    }
  },
  {
    id: "starMap",
    name: "Carte celeste",
    cost: 9600,
    text: "+3 etincelles par pression et production +30%",
    apply(state) {
      state.clickBonus += 3;
      state.globalMultiplier += 0.3;
    }
  }
];

const orders = [
  {
    id: "firstLight",
    name: "Premiere lumiere",
    target: 120,
    text: "Avoir 120 etincelles en reserve",
    reward: "Production globale +10%",
    canClaim: (state) => state.sparks >= 120,
    progress: (state) => state.sparks / 120,
    claim(state) {
      state.globalMultiplier += 0.1;
    }
  },
  {
    id: "steadyShop",
    name: "Atelier stable",
    target: 12,
    text: "Posseder 12 machines",
    reward: "+2 etincelles par pression",
    canClaim: (state) => totalBuildings(state) >= 12,
    progress: (state) => totalBuildings(state) / 12,
    claim(state) {
      state.clickBonus += 2;
    }
  },
  {
    id: "brightLine",
    name: "Ligne brillante",
    target: 35,
    text: "Atteindre 35 etincelles par seconde",
    reward: "Production globale +20%",
    canClaim: (state) => productionPerSecond(state) >= 35,
    progress: (state) => productionPerSecond(state) / 35,
    claim(state) {
      state.globalMultiplier += 0.2;
    }
  }
];

const defaultState = {
  sparks: 0,
  totalEarned: 0,
  clickBonus: 0,
  globalMultiplier: 1,
  buildings: Object.fromEntries(buildings.map((item) => [item.id, 0])),
  buildingMultipliers: Object.fromEntries(buildings.map((item) => [item.id, 1])),
  purchasedUpgrades: [],
  completedOrders: [],
  log: ["Le noyau attend sa premiere etincelle."],
  lastSavedAt: Date.now(),
  lastTickAt: Date.now()
};

let state = loadState();
let lastFrame = performance.now();

const elements = {
  sparkCount: document.querySelector("#sparkCount"),
  sparkRate: document.querySelector("#sparkRate"),
  clickPower: document.querySelector("#clickPower"),
  saveStatus: document.querySelector("#saveStatus"),
  rankLabel: document.querySelector("#rankLabel"),
  reactorButton: document.querySelector("#reactorButton"),
  buildingList: document.querySelector("#buildingList"),
  upgradeList: document.querySelector("#upgradeList"),
  orderList: document.querySelector("#orderList"),
  completedOrders: document.querySelector("#completedOrders"),
  eventLog: document.querySelector("#eventLog"),
  saveDialog: document.querySelector("#saveDialog"),
  savePayload: document.querySelector("#savePayload"),
  dialogTitle: document.querySelector("#dialogTitle"),
  exportSave: document.querySelector("#exportSave"),
  importSave: document.querySelector("#importSave"),
  copySave: document.querySelector("#copySave"),
  loadSave: document.querySelector("#loadSave"),
  resetSave: document.querySelector("#resetSave")
};

applyPurchasedUpgrades();
applyOfflineProgress();
render();
requestAnimationFrame(tick);
setInterval(saveGame, 5000);

elements.reactorButton.addEventListener("click", (event) => {
  const gain = clickPower();
  addSparks(gain);
  popSpark(event.clientX, event.clientY, gain);
  addLog(`+${format(gain)} depuis le noyau.`);
  render();
});

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
    const imported = JSON.parse(atob(elements.savePayload.value.trim()));
    state = normalizeState(imported);
    applyPurchasedUpgrades();
    saveGame();
    render();
    elements.saveDialog.close();
    setStatus("Sauvegarde importee");
  } catch {
    setStatus("Import impossible");
  }
});

elements.resetSave.addEventListener("click", () => {
  const confirmation = window.confirm("Reinitialiser la progression locale ?");
  if (!confirmation) return;
  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(defaultState);
  state.lastSavedAt = Date.now();
  state.lastTickAt = Date.now();
  addLog("Un nouvel atelier est pret.");
  saveGame();
  render();
});

function tick(now) {
  const deltaSeconds = Math.min((now - lastFrame) / 1000, 1);
  lastFrame = now;
  const passiveGain = productionPerSecond(state) * deltaSeconds;
  if (passiveGain > 0) {
    addSparks(passiveGain);
    renderMetrics();
    refreshAffordability();
  }
  requestAnimationFrame(tick);
}

function addSparks(amount) {
  state.sparks += amount;
  state.totalEarned += amount;
}

function buyBuilding(id) {
  const building = buildings.find((item) => item.id === id);
  const cost = buildingCost(building);
  if (state.sparks < cost) return;
  state.sparks -= cost;
  state.buildings[id] += 1;
  addLog(`${building.name} ajoute a l'atelier.`);
  render();
}

function buyUpgrade(id) {
  const upgrade = upgrades.find((item) => item.id === id);
  if (!upgrade || state.purchasedUpgrades.includes(id) || state.sparks < upgrade.cost) return;
  state.sparks -= upgrade.cost;
  state.purchasedUpgrades.push(id);
  upgrade.apply(state);
  addLog(`${upgrade.name} debloque.`);
  render();
}

function claimOrder(id) {
  const order = orders.find((item) => item.id === id);
  if (!order || state.completedOrders.includes(id) || !order.canClaim(state)) return;
  state.completedOrders.push(id);
  order.claim(state);
  addLog(`${order.name} terminee. ${order.reward}`);
  render();
}

function buildingCost(building) {
  const owned = state.buildings[building.id] || 0;
  return Math.floor(building.baseCost * Math.pow(building.scale, owned));
}

function productionPerSecond(currentState) {
  const raw = buildings.reduce((sum, building) => {
    const owned = currentState.buildings[building.id] || 0;
    const multiplier = currentState.buildingMultipliers[building.id] || 1;
    return sum + owned * building.rate * multiplier;
  }, 0);

  return raw * currentState.globalMultiplier;
}

function clickPower() {
  return 1 + state.clickBonus + Math.floor(totalBuildings(state) / 25);
}

function totalBuildings(currentState) {
  return Object.values(currentState.buildings).reduce((sum, owned) => sum + owned, 0);
}

function render() {
  renderMetrics();
  renderBuildings();
  renderUpgrades();
  renderOrders();
  renderLog();
}

function renderMetrics() {
  elements.sparkCount.textContent = format(state.sparks);
  elements.sparkRate.textContent = format(productionPerSecond(state));
  elements.clickPower.textContent = format(clickPower());
  elements.rankLabel.textContent = currentRank();
}

function renderBuildings() {
  elements.buildingList.innerHTML = "";
  buildings.forEach((building) => {
    const cost = buildingCost(building);
    const owned = state.buildings[building.id] || 0;
    const multiplier = state.buildingMultipliers[building.id] || 1;
    const row = document.createElement("article");
    row.className = "buy-row";
    row.innerHTML = `
      <div>
        <div class="row-title">
          <span class="row-icon">${building.icon}</span>
          <span>${building.name} x${owned}</span>
        </div>
        <div class="row-meta">${building.text} ${format(building.rate * multiplier * state.globalMultiplier)} / sec chacune.</div>
      </div>
      <button class="buy-button" type="button" ${state.sparks < cost ? "disabled" : ""}>${format(cost)}</button>
    `;
    row.querySelector("button").addEventListener("click", () => buyBuilding(building.id));
    elements.buildingList.append(row);
  });
}

function renderUpgrades() {
  elements.upgradeList.innerHTML = "";
  upgrades.forEach((upgrade) => {
    const purchased = state.purchasedUpgrades.includes(upgrade.id);
    const row = document.createElement("article");
    row.className = `upgrade-row${purchased ? " purchased" : ""}`;
    row.innerHTML = `
      <div>
        <div class="row-title">
          <span class="row-icon">+</span>
          <span>${upgrade.name}</span>
        </div>
        <div class="row-meta">${upgrade.text}</div>
      </div>
      <button class="upgrade-button" type="button" ${purchased || state.sparks < upgrade.cost ? "disabled" : ""}>${purchased ? "Acquis" : format(upgrade.cost)}</button>
    `;
    row.querySelector("button").addEventListener("click", () => buyUpgrade(upgrade.id));
    elements.upgradeList.append(row);
  });
}

function renderOrders() {
  elements.orderList.innerHTML = "";
  elements.completedOrders.textContent = `${state.completedOrders.length} / ${orders.length}`;
  orders.forEach((order) => {
    const completed = state.completedOrders.includes(order.id);
    const canClaim = !completed && order.canClaim(state);
    const progress = Math.max(0, Math.min(order.progress(state), 1));
    const row = document.createElement("article");
    row.className = "order-row";
    row.innerHTML = `
      <div>
        <div class="row-title">
          <span class="row-icon">*</span>
          <span>${order.name}</span>
        </div>
        <div class="row-meta">${order.text}. ${order.reward}</div>
        <div class="progress" aria-hidden="true"><span style="--progress: ${Math.round(progress * 100)}%"></span></div>
      </div>
      <button class="claim-button" type="button" ${!canClaim ? "disabled" : ""}>${completed ? "Termine" : "Valider"}</button>
    `;
    row.querySelector("button").addEventListener("click", () => claimOrder(order.id));
    elements.orderList.append(row);
  });
}

function renderLog() {
  elements.eventLog.innerHTML = "";
  state.log.slice(0, 6).forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = entry;
    elements.eventLog.append(item);
  });
}

function refreshAffordability() {
  document.querySelectorAll(".buy-row").forEach((row, index) => {
    const button = row.querySelector("button");
    button.disabled = state.sparks < buildingCost(buildings[index]);
  });

  document.querySelectorAll(".upgrade-row").forEach((row, index) => {
    const upgrade = upgrades[index];
    const button = row.querySelector("button");
    button.disabled = state.purchasedUpgrades.includes(upgrade.id) || state.sparks < upgrade.cost;
  });

  document.querySelectorAll(".order-row").forEach((row, index) => {
    const order = orders[index];
    const button = row.querySelector("button");
    button.disabled = state.completedOrders.includes(order.id) || !order.canClaim(state);
  });
}

function currentRank() {
  const earned = state.totalEarned;
  if (earned >= 50000) return "Rang V - Cartographe solaire";
  if (earned >= 12000) return "Rang IV - Maitre d'orbite";
  if (earned >= 2500) return "Rang III - Artisan astral";
  if (earned >= 500) return "Rang II - Noyau regulier";
  return "Rang I - Allumage";
}

function addLog(message) {
  state.log = [message, ...state.log].slice(0, 12);
}

function popSpark(x, y, amount) {
  const pop = document.createElement("span");
  pop.className = "spark-pop";
  pop.textContent = `+${format(amount)}`;
  pop.style.left = `${x}px`;
  pop.style.top = `${y}px`;
  document.body.append(pop);
  window.setTimeout(() => pop.remove(), 950);
}

function saveGame() {
  state.lastSavedAt = Date.now();
  state.lastTickAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  setStatus("Sauvegarde auto");
}

function setStatus(text) {
  elements.saveStatus.textContent = text;
  window.clearTimeout(setStatus.timeout);
  setStatus.timeout = window.setTimeout(() => {
    elements.saveStatus.textContent = "Sauvegarde prete";
  }, 1800);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultState);
  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return structuredClone(defaultState);
  }
}

function normalizeState(input) {
  const merged = structuredClone(defaultState);
  Object.assign(merged, input);
  merged.buildings = { ...defaultState.buildings, ...(input.buildings || {}) };
  merged.buildingMultipliers = { ...defaultState.buildingMultipliers, ...(input.buildingMultipliers || {}) };
  merged.purchasedUpgrades = Array.isArray(input.purchasedUpgrades) ? input.purchasedUpgrades : [];
  merged.completedOrders = Array.isArray(input.completedOrders) ? input.completedOrders : [];
  merged.log = Array.isArray(input.log) && input.log.length ? input.log : defaultState.log;
  return merged;
}

function applyPurchasedUpgrades() {
  const purchased = [...state.purchasedUpgrades];
  state.clickBonus = 0;
  state.globalMultiplier = 1;
  state.buildingMultipliers = Object.fromEntries(buildings.map((item) => [item.id, 1]));
  state.purchasedUpgrades = [];
  purchased.forEach((id) => {
    const upgrade = upgrades.find((item) => item.id === id);
    if (upgrade) {
      state.purchasedUpgrades.push(id);
      upgrade.apply(state);
    }
  });
  orders.forEach((order) => {
    if (state.completedOrders.includes(order.id)) {
      order.claim(state);
    }
  });
}

function applyOfflineProgress() {
  const now = Date.now();
  const elapsed = Math.max(0, Math.min((now - (state.lastTickAt || now)) / 1000, 60 * 60 * 6));
  const gained = productionPerSecond(state) * elapsed;
  if (gained > 1) {
    addSparks(gained);
    addLog(`Retour atelier: +${format(gained)} etincelles.`);
  }
  state.lastTickAt = now;
}

function format(value) {
  if (value < 1000) {
    return value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2).replace(/\.00$/, "");
  }

  const units = ["K", "M", "B", "T"];
  let scaled = value;
  let unit = "";
  for (const nextUnit of units) {
    scaled /= 1000;
    unit = nextUnit;
    if (scaled < 1000) break;
  }
  return `${scaled.toFixed(scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2)}${unit}`;
}
