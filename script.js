// Initialize Game Variables
const homeZone = document.getElementById("home-zone");
const field = document.getElementById("field");
const npc = document.getElementById("npc");

let activeQuest = { type: "mushroom", count: 5 }; // Current quest
let collectedItems = 0;

// Create Player
const player = document.createElement("div");
player.classList.add("player");
field.appendChild(player);

// Player Position
let playerX = 200;
let playerY = 200;

// Move Player
function movePlayer(x, y) {
    playerX = Math.min(Math.max(playerX + x, 0), field.clientWidth - 40);
    playerY = Math.min(Math.max(playerY + y, 0), field.clientHeight - 40);
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

// Spawn Items
function spawnItems(type, count) {
    for (let i = 0; i < count; i++) {
        const item = document.createElement("div");
        item.classList.add("item", type);
        item.style.left = `${Math.random() * (field.clientWidth - 30)}px`;
        item.style.top = `${Math.random() * (field.clientHeight - 30)}px`;
        field.appendChild(item);
    }
}

// Check for Item Collection
function checkItemCollection() {
    const items = document.querySelectorAll(`.item.${activeQuest.type}`);
    items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            playerRect.left < itemRect.right &&
            playerRect.right > itemRect.left &&
            playerRect.top < itemRect.bottom &&
            playerRect.bottom > itemRect.top
        ) {
            item.remove();
            collectedItems++;
            updateNPC();
        }
    });
}

// Update NPC Dialogue
function updateNPC() {
    if (collectedItems >= activeQuest.count) {
        npc.textContent = `Great job! Bring the items to the Home Zone!`;
    } else {
        npc.textContent = `Collect ${activeQuest.count - collectedItems} more ${activeQuest.type}s!`;
    }
}

// Event Listeners for Movement
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") movePlayer(0, -20);
    if (e.key === "ArrowDown") movePlayer(0, 20);
    if (e.key === "ArrowLeft") movePlayer(-20, 0);
    if (e.key === "ArrowRight") movePlayer(20, 0);

    checkItemCollection();
});

// Start Game
spawnItems("mushroom", 10);
updateNPC();
