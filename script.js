// Initialize Game Variables
const homeZone = document.getElementById("home-zone");
const field = document.getElementById("field");
const npc = document.getElementById("npc");

const itemTypes = ["flower", "mushroom", "bug"];
let activeQuest = { type: "mushroom", count: 5 }; // Current quest
let collectedItems = 0;
let completedQuests = [];

// Quest Progress Bar
const questProgressBar = document.createElement("div");
questProgressBar.style.position = "absolute";
questProgressBar.style.top = "10px";
questProgressBar.style.left = "50%";
questProgressBar.style.transform = "translateX(-50%)";
questProgressBar.style.width = "200px";
questProgressBar.style.height = "20px";
questProgressBar.style.backgroundColor = "#ddd";
questProgressBar.style.border = "1px solid #aaa";
questProgressBar.style.borderRadius = "5px";

const questProgressFill = document.createElement("div");
questProgressFill.style.height = "100%";
questProgressFill.style.backgroundColor = "#76c7c0";
questProgressFill.style.width = "0%";
questProgressFill.style.borderRadius = "5px";
questProgressFill.style.transition = "width 0.3s ease-in-out"; // Smooth animation

questProgressBar.appendChild(questProgressFill);
field.appendChild(questProgressBar);

// Create Player
const player = document.createElement("div");
player.classList.add("player");
field.appendChild(player);

// Player Position
let playerX = 200;
let playerY = 200;

// Move Player
function movePlayer(x, y) {
    const maxWidth = field.clientWidth + homeZone.clientWidth - 40; // Combine the widths of both zones
    playerX = Math.min(Math.max(playerX + x, 0), maxWidth); // Allow movement across zones
    playerY = Math.min(Math.max(playerY + y, 0), field.clientHeight - 40); // Maintain height limit
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

// Respawn Collected Items
function respawnItems(type, count) {
    spawnItems(type, count);
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
            animateItemCollection(item); // Add collection animation
            item.remove();
            collectedItems++;
            updateQuestProgress();

            // Respawn the collected item
            respawnItems(activeQuest.type, 1);
        }
    });
}

// Animate Item Collection
function animateItemCollection(item) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    sparkle.style.left = `${item.offsetLeft}px`;
    sparkle.style.top = `${item.offsetTop}px`;
    field.appendChild(sparkle);

    // Remove the sparkle after animation
    setTimeout(() => {
        sparkle.remove();
    }, 500);
}

// Update Quest Progress
function updateQuestProgress() {
    const progress = (collectedItems / activeQuest.count) * 100;
    questProgressFill.style.width = `${Math.min(progress, 100)}%`;
    updateNPC();
}

// Update NPC Dialogue
function updateNPC() {
    if (collectedItems >= activeQuest.count) {
        npc.textContent = `Great job! Bring the items to the Home Zone!`;
    } else {
        npc.textContent = `Collect ${activeQuest.count - collectedItems} more ${activeQuest.type}(s)!`;
    }
}

// Check for Home Zone Interaction
function checkHomeZoneInteraction() {
    const homeZoneWidth = homeZone.clientWidth;
    if (playerX < homeZoneWidth) {
        // Player is in the Home Zone
        if (collectedItems >= activeQuest.count) {
            depositItems();
        }
    }
}

// Deposit Items in Home Zone
function depositItems() {
    // Add collected items visually to the Home Zone
    for (let i = 0; i < activeQuest.count; i++) {
        const depositedItem = document.createElement("div");
        depositedItem.classList.add("item", activeQuest.type);
        homeZone.appendChild(depositedItem);
    }

    // Log the completed quest
    logCompletedQuest(activeQuest.type, activeQuest.count);

    // Reset collected items and assign a new quest
    collectedItems = 0;
    assignNewQuest();
    updateQuestProgress();
}

// Log Completed Quests
function logCompletedQuest(type, count) {
    const questLog = document.getElementById("completed-quests");
    const logEntry = document.createElement("li");
    logEntry.textContent = `Collected ${count} ${type}(s)`;
    questLog.appendChild(logEntry);
}

// Assign a New Quest
function assignNewQuest() {
    const nextType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const nextCount = Math.floor(Math.random() * 5) + 3; // Random count between 3 and 7
    activeQuest = { type: nextType, count: nextCount };

    // Update NPC dialogue
    npc.textContent = `New Quest: Collect ${activeQuest.count} ${activeQuest.type}(s)!`;

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

    // Clear the Home Zone and Quest Log
    document.getElementById("depot").innerHTML = "";
    document.getElementById("completed-quests").innerHTML = "";

    // Assign initial quest
    assignNewQuest();

    // Spawn initial items
    spawnItems(activeQuest.type, 10);

    // Reset quest progress
    updateQuestProgress();
}

// Initialize the game
startGame();
