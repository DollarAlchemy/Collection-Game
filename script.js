// Initialize Game Variables
const homeZone = document.getElementById("home-zone");
const field = document.getElementById("field");
const npc = document.getElementById("npc");

const itemTypes = ["flower", "mushroom", "bug"];
let activeQuest = { type: "mushroom", count: 5 }; // Current quest
let collectedItems = 0;
let completedQuests = [];

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

    // Check for item collection
    checkItemCollection();

    // Check for depositing items in Home Zone
    checkHomeZoneInteraction();
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

// Check for Home Zone Interaction
function checkHomeZoneInteraction() {
    const homeZoneRect = homeZone.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
        playerRect.left < homeZoneRect.right &&
        playerRect.right > homeZoneRect.left &&
        playerRect.top < homeZoneRect.bottom &&
        playerRect.bottom > homeZoneRect.top &&
        collectedItems >= activeQuest.count
    ) {
        depositItems();
    }
}

// Deposit Items in Home Zone
function depositItems() {
    // Add the items to the Home Zone display
    for (let i = 0; i < activeQuest.count; i++) {
        const depositedItem = document.createElement("div");
        depositedItem.classList.add("item", activeQuest.type);
        homeZone.appendChild(depositedItem);
    }

    // Track completed quest
    completedQuests.push({ type: activeQuest.type, count: activeQuest.count });

    // Reset collected items and assign a new quest
    collectedItems = 0;
    assignNewQuest();
}

// Assign a New Quest
function assignNewQuest() {
    const nextType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const nextCount = Math.floor(Math.random() * 5) + 3; // Random count between 3 and 7
    activeQuest = { type: nextType, count: nextCount };

    // Update NPC dialogue
    npc.textContent = `New Quest: Collect ${activeQuest.count} ${activeQuest.type}s!`;

    // Spawn new items
    spawnItems(nextType, 10);
}

// Event Listeners for Movement
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") movePlayer(0, -20);
    if (e.key === "ArrowDown") movePlayer(0, 20);
    if (e.key === "ArrowLeft") movePlayer(-20, 0);
    if (e.key === "ArrowRight") movePlayer(20, 0);
});

// Start Game
function startGame() {
    // Reset state
    completedQuests = [];
    collectedItems = 0;

    // Assign initial quest
    assignNewQuest();

    // Spawn initial items
    spawnItems(activeQuest.type, 10);
}

// Initialize the game
startGame();
