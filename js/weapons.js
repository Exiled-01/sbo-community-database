// =========================================
// WEAPON DATABASE
// =========================================

let allWeapons = [];
let currentWeapons = [];
let selectedCategory = "All";

// Attack values in this dataset run roughly 0 to 200; used to size
// the stat meter bar on each card relative to the whole weapon list.
const MAX_ATTACK_SCALE = 200;

function formatAttack(weapon) {
  if (weapon.scaling && weapon.attackMin !== undefined) {
    return `${weapon.attackMin} - ${weapon.attack}`;
  }
  return weapon.attack;
}

function formatLevel(weapon) {
  if (weapon.scaling && weapon.levelMin !== undefined) {
    return `${weapon.levelMin} - ${weapon.level}`;
  }
  return weapon.level;
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("data/weapons.json")
    .then(response => response.json())
    .then(data => {
      allWeapons = data;
      currentWeapons = data;
      displayWeapons();
    })
    .catch(error => {
      console.error("Weapon loading error:", error);
    });

  setupSearch();
  setupSorting();
  setupCategoryButtons();
});

function displayWeapons() {
  const container = document.getElementById("weapon-container");

  let weapons = [...currentWeapons];

  if (selectedCategory !== "All") {
    weapons = weapons.filter(weapon => weapon.type === selectedCategory);
  }

  if (weapons.length === 0) {
    container.innerHTML = `<h2 class="no-results">No weapons found</h2>`;
    return;
  }

  container.innerHTML = weapons
    .map(weapon => {
      const attackPct = Math.min(100, Math.round((weapon.attack / MAX_ATTACK_SCALE) * 100));
      return `
        <div class="item-card">
          <span class="item-card-meta">${weapon.type}</span>
          <h2 class="item-card-title">${weapon.name}</h2>

          <div class="stat-row">
            <span class="stat-row-label">⚔ Attack</span>
            <span class="stat-row-value">${formatAttack(weapon)}</span>
          </div>
          <div class="stat-meter"><div class="stat-meter-fill" style="width:${attackPct}%"></div></div>

          <div class="stat-row">
            <span class="stat-row-label">Level</span>
            <span class="stat-row-value">${formatLevel(weapon)}</span>
          </div>

          ${weapon.scaling ? `<p class="scaling-note">📈 Stats scale with player level</p>` : ""}

          <button class="details-btn" data-name="${weapon.name}">View Details</button>
        </div>
      `;
    })
    .join("");

  setupDetails();
}

function filterWeaponsBySearch() {
  const searchBox = document.getElementById("weapon-search");
  const value = searchBox ? searchBox.value.toLowerCase().trim() : "";

  return allWeapons.filter(weapon => {
    const name = (weapon.name || "").toLowerCase();
    const type = (weapon.type || "").toLowerCase();
    const obtain = (weapon.obtain || "").toLowerCase();
    return name.includes(value) || type.includes(value) || obtain.includes(value);
  });
}

function applySort(list) {
  const sort = document.getElementById("weapon-sort");
  const value = sort ? sort.value : "default";

  switch (value) {
    case "level-high":
      list.sort((a, b) => b.level - a.level);
      break;
    case "level-low":
      list.sort((a, b) => a.level - b.level);
      break;
    case "attack-high":
      list.sort((a, b) => b.attack - a.attack);
      break;
    case "attack-low":
      list.sort((a, b) => a.attack - b.attack);
      break;
  }
}

function refreshWeaponList() {
  currentWeapons = filterWeaponsBySearch();
  applySort(currentWeapons);
  displayWeapons();
}

function setupSearch() {
  const search = document.getElementById("weapon-search");
  if (!search) return;

  let debounce;
  search.addEventListener("input", function () {
    clearTimeout(debounce);
    debounce = setTimeout(refreshWeaponList, 150);
  });
}

function setupSorting() {
  const sort = document.getElementById("weapon-sort");
  if (!sort) return;

  sort.addEventListener("change", function () {
    refreshWeaponList();
  });
}

function setupCategoryButtons() {
  const buttons = document.querySelectorAll("#weapon-category-row .chip[data-type]");
  const showAll = document.getElementById("show-all-weapons");

  function setActive(activeButton) {
    buttons.forEach(b => b.classList.remove("active"));
    if (showAll) showAll.classList.remove("active");
    if (activeButton) activeButton.classList.add("active");
  }

  buttons.forEach(button => {
    button.onclick = function () {
      selectedCategory = this.dataset.type;
      setActive(this);
      displayWeapons();
    };
  });

  if (showAll) {
    showAll.onclick = function () {
      selectedCategory = "All";
      setActive(showAll);
      displayWeapons();
    };
  }
}

function setupDetails() {
  document.querySelectorAll(".details-btn").forEach(button => {
    button.onclick = function () {
      const weapon = allWeapons.find(item => item.name === this.dataset.name);
      showWeaponDetails(weapon);
    };
  });
}

function showWeaponDetails(weapon) {
  const box = document.getElementById("weapon-details-box");
  const content = document.getElementById("weapon-details-content");

  if (!weapon) return;

  content.innerHTML = `
    <h2>${weapon.name}</h2>
    <p>⚔ Attack: <span class="modal-value">${formatAttack(weapon)}</span></p>
    <p>Level Requirement: <span class="modal-value">${formatLevel(weapon)}</span></p>
    ${weapon.scaling ? `<p class="scaling-note">📈 Stats scale with player level</p>` : ""}
    <p>Weapon Type: <span class="modal-value">${weapon.type}</span></p>
    <p>How To Obtain:<br>${weapon.obtain}</p>
  `;

  box.classList.add("visible");
}

document.addEventListener("click", function (event) {
  if (event.target.id === "close-details") {
    document.getElementById("weapon-details-box").classList.remove("visible");
  }
});

// =========================================
// OPEN ITEM FROM HOMEPAGE SEARCH
// =========================================

window.addEventListener("load", function () {
  setTimeout(() => {
    if (!location.hash) return;

    const itemName = decodeURIComponent(location.hash.substring(1));
    const cards = document.querySelectorAll(".item-card");

    cards.forEach(card => {
      if (card.innerText.includes(itemName)) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("pulse-highlight");
      }
    });
  }, 500);
});
