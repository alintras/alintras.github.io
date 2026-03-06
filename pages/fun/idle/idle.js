/* -------------------------
   CLICK COUNTER
-------------------------- */
let clicks = 0;
function addClick() {
    clicks++;
    document.getElementById("clicks").innerText = clicks;
}

/* -------------------------
   IDLE ECONOMY
-------------------------- */
let points = parseFloat(localStorage.getItem("idle_points")) || 0;
let rate = parseFloat(localStorage.getItem("idle_rate")) || 1;

function updateEconomyUI() {
    document.getElementById("points").innerText = points.toFixed(1);
    document.getElementById("rate").innerText = rate.toFixed(1);
}

function saveEconomy() {
    localStorage.setItem("idle_points", points);
    localStorage.setItem("idle_rate", rate);
}

function buyUpgrade() {
    const cost = rate * 10;
    if (points >= cost) {
        points -= cost;
        rate += 1;
        saveEconomy();
        updateEconomyUI();
    } else {
        alert("Not enough points");
    }
}

/* idle tick (10x/sec) */
setInterval(() => {
    points += rate / 10;
    updateEconomyUI();
    saveEconomy();
}, 100);

updateEconomyUI();

/* -------------------------
   LOOT SIMULATOR
-------------------------- */
const lootTable = [
    { name: "Common", chance: 0.7 },
    { name: "Rare", chance: 0.25 },
    { name: "Epic", chance: 0.045 },
    { name: "Legendary", chance: 0.005 }
];

let lootCounts = JSON.parse(localStorage.getItem("idle_loot")) || {
    Common: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0,
    total: 0
};

function openLoot() {
    const roll = Math.random();
    let acc = 0;

    for (let item of lootTable) {
        acc += item.chance;
        if (roll <= acc) {
            lootCounts[item.name]++;
            lootCounts.total++;
            document.getElementById("lootResult").innerText =
                "You got: " + item.name;
            break;
        }
    }

    updateLootStats();
    localStorage.setItem("idle_loot", JSON.stringify(lootCounts));
}

function updateLootStats() {
    const t = lootCounts.total || 1;
    document.getElementById("lootStats").innerHTML = `
        Total opens: ${lootCounts.total}<br>
        Common: ${(lootCounts.Common / t * 100).toFixed(1)}%<br>
        Rare: ${(lootCounts.Rare / t * 100).toFixed(1)}%<br>
        Epic: ${(lootCounts.Epic / t * 100).toFixed(2)}%<br>
        Legendary: ${(lootCounts.Legendary / t * 100).toFixed(3)}%
    `;
}

updateLootStats();

/* -------------------------
   RANDOM NUMBER
-------------------------- */
function randomNumber() {
    document.getElementById("randNum").innerText =
        Math.floor(Math.random() * 100000);
}

/* -------------------------
   REACTION TEST
-------------------------- */
let reactionStart = 0;
function startReaction() {
    document.getElementById("reaction").innerText = "Wait…";
    setTimeout(() => {
        reactionStart = Date.now();
        document.getElementById("reaction").innerText = "CLICK!";
        document.body.onclick = () => {
            document.getElementById("reaction").innerText =
                (Date.now() - reactionStart) + " ms";
            document.body.onclick = null;
        };
    }, Math.random() * 3000 + 1000);
}

/* -------------------------
   FORTUNE
-------------------------- */
const fortunes = [
    "You will come back.",
    "Numbers will go up.",
    "Luck favors patience.",
    "Nothing happens.",
    "Unexpected progress."
];

function fortune() {
    document.getElementById("fortune").innerText =
        fortunes[Math.floor(Math.random() * fortunes.length)];
}
