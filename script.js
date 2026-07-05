let xp = 0;
let level = 1;
let playerName = localStorage.getItem("playerName") || "Hunter";
let stats = {
    body: 0,
    mind: 0,
    social: 0,
    wealth: 0,
    spirit: 0,
    creativity: 0
};

let substats = {
    body: { strength: 0, endurance: 0, agility: 0 },
    mind: { focus: 0, learning: 0, discipline: 0 },
    social: { charisma: 0, empathy: 0, teamwork: 0 },
    wealth: { saving: 0, career: 0, investing: 0 },
    spirit: { meditation: 0, gratitude: 0, purpose: 0 },
    creativity: { imagination: 0, expression: 0, innovation: 0 }
};

let weeklyProgress = {};
let weeklyRewards = {};
let weeklyQuestIds = [];

const weeklyRewardAmount = 100;
const dailyQuestCount = 24;
const questsPerCategory = 4;
const healthyLifeQuestDailyCount = 6;
const healthyLifeQuestCategoryName = "Healthy Life Choices";
let healthyLifeQuestIds = JSON.parse(localStorage.getItem("healthyLifeQuestIds")) || [];
let healthyLifeQuestPage = Number(localStorage.getItem("healthyLifeQuestPage")) || 0;
let healthyLifeQuestDate = localStorage.getItem("healthyLifeQuestDate") || "";

const weeklyQuestPool = [
    { id: "weekly1", label: "Complete 7 Body Quests", type: "category", categories: ["Body"], goal: 7 },
    { id: "weekly2", label: "Complete 5 Wealth Quests", type: "category", categories: ["Wealth"], goal: 5 },
    { id: "weekly3", label: "Complete 6 Social Quests", type: "category", categories: ["Social"], goal: 6 },
    { id: "weekly4", label: "Complete 5 Mind or Spirit Quests", type: "category", categories: ["Mind", "Spirit"], goal: 5 },
    { id: "weekly5", label: "Complete 4 Creativity Quests", type: "category", categories: ["Creativity"], goal: 4 },
    { id: "weekly6", label: "Earn 200 XP from Daily Quests", type: "xp", goal: 200 },
    { id: "weekly7", label: "Complete 4 Mind Quests", type: "category", categories: ["Mind"], goal: 4 },
    { id: "weekly8", label: "Complete 4 Spirit Quests", type: "category", categories: ["Spirit"], goal: 4 },
    { id: "weekly9", label: "Complete 5 Body or Creativity Quests", type: "category", categories: ["Body", "Creativity"], goal: 5 }
];

const weeklyQuestDefinitionsById = Object.fromEntries(weeklyQuestPool.map((quest) => [quest.id, quest]));

const questDefinitions = [

    // ===== BODY =====
    { id: "quest1", label: "30 Min Workout", xp: 10, category: "Body", stat: "body", substat: "strength" },
    { id: "quest2", label: "15 Min Stretch", xp: 15, category: "Body", stat: "body", substat: "endurance" },
    { id: "quest3", label: "10 Min Run", xp: 20, category: "Body", stat: "body", substat: "agility" },
    { id: "quest4", label: "10,000 Steps", xp: 25, category: "Body", stat: "body", substat: "strength" },

    // ===== MIND =====
    { id: "quest5", label: "Study for 20 Minutes", xp: 10, category: "Mind", stat: "mind", substat: "focus" },
    { id: "quest6", label: "Read 15 Pages", xp: 15, category: "Mind", stat: "mind", substat: "learning" },
    { id: "quest7", label: "Practice Focus for 10 Minutes", xp: 20, category: "Mind", stat: "mind", substat: "discipline" },
    { id: "quest8", label: "Learn Something New", xp: 25, category: "Mind", stat: "mind", substat: "learning" },

    // ===== SOCIAL =====
    { id: "quest9", label: "Call or Message a Friend", xp: 10, category: "Social", stat: "social", substat: "charisma" },
    { id: "quest10", label: "Help Someone Today", xp: 15, category: "Social", stat: "social", substat: "empathy" },
    { id: "quest11", label: "Join a Group or Conversation", xp: 20, category: "Social", stat: "social", substat: "teamwork" },
    { id: "quest12", label: "Give Someone a Genuine Compliment", xp: 25, category: "Social", stat: "social", substat: "charisma" },

    // ===== WEALTH =====
    { id: "quest13", label: "Track Your Spending", xp: 10, category: "Wealth", stat: "wealth", substat: "saving" },
    { id: "quest14", label: "Save a Small Amount", xp: 15, category: "Wealth", stat: "wealth", substat: "saving" },
    { id: "quest15", label: "Plan a Budget or Goal", xp: 20, category: "Wealth", stat: "wealth", substat: "investing" },
    { id: "quest16", label: "Research Investing for 15 Minutes", xp: 25, category: "Wealth", stat: "wealth", substat: "career" },

    // ===== SPIRIT =====
    { id: "quest17", label: "Meditate for 10 Minutes", xp: 10, category: "Spirit", stat: "spirit", substat: "meditation" },
    { id: "quest18", label: "Write 3 Things You're Grateful For", xp: 15, category: "Spirit", stat: "spirit", substat: "gratitude" },
    { id: "quest19", label: "Reflect on Your Purpose", xp: 20, category: "Spirit", stat: "spirit", substat: "purpose" },
    { id: "quest20", label: "Spend 15 Minutes in Nature", xp: 25, category: "Spirit", stat: "spirit", substat: "meditation" },

    // ===== CREATIVITY =====
    { id: "quest21", label: "Make Something Creative", xp: 10, category: "Creativity", stat: "creativity", substat: "imagination" },
    { id: "quest22", label: "Write or Sketch for 15 Minutes", xp: 15, category: "Creativity", stat: "creativity", substat: "expression" },
    { id: "quest23", label: "Try a New Idea Today", xp: 20, category: "Creativity", stat: "creativity", substat: "innovation" },
    { id: "quest24", label: "Work on a Personal Project", xp: 25, category: "Creativity", stat: "creativity", substat: "innovation" },

    // ===== HEALTHY LIFE CHOICES =====
    { id: "quest25", label: "Drink 2 Liters of Water", xp: 10, category: "Healthy Life Choices", stat: "body", substat: "endurance" },
    { id: "quest26", label: "Eat a Balanced Meal", xp: 10, category: "Healthy Life Choices", stat: "body", substat: "strength" },
    { id: "quest27", label: "Take a 10 Minute Walk", xp: 10, category: "Healthy Life Choices", stat: "body", substat: "agility" },
    { id: "quest28", label: "Stretch for 10 Minutes", xp: 10, category: "Healthy Life Choices", stat: "body", substat: "endurance" },
    { id: "quest29", label: "Sleep 7+ Hours Tonight", xp: 15, category: "Healthy Life Choices", stat: "spirit", substat: "meditation" },
    { id: "quest30", label: "Prep a Healthy Snack", xp: 15, category: "Healthy Life Choices", stat: "body", substat: "strength" },
    { id: "quest31", label: "Avoid Sugary Drinks Today", xp: 15, category: "Healthy Life Choices", stat: "body", substat: "endurance" },
    { id: "quest32", label: "Do a Short Mobility Routine", xp: 15, category: "Healthy Life Choices", stat: "body", substat: "agility" },
    { id: "quest33", label: "Practice Deep Breathing", xp: 15, category: "Healthy Life Choices", stat: "spirit", substat: "purpose" },
    { id: "quest34", label: "Limit Screen Time for 30 Minutes", xp: 15, category: "Healthy Life Choices", stat: "mind", substat: "discipline" },
    { id: "quest35", label: "Enjoy a Fruit or Veggie with Every Meal", xp: 20, category: "Healthy Life Choices", stat: "body", substat: "strength" },
    { id: "quest36", label: "Take the Stairs Instead of the Elevator", xp: 20, category: "Healthy Life Choices", stat: "body", substat: "agility" },
    { id: "quest37", label: "Do a 15 Minute Yoga Session", xp: 20, category: "Healthy Life Choices", stat: "spirit", substat: "meditation" },
    { id: "quest38", label: "Pack a Healthy Lunch", xp: 20, category: "Healthy Life Choices", stat: "wealth", substat: "saving" },
    { id: "quest39", label: "Spend 10 Minutes Outside", xp: 20, category: "Healthy Life Choices", stat: "spirit", substat: "gratitude" },
    { id: "quest40", label: "Set a Healthy Habit Goal", xp: 20, category: "Healthy Life Choices", stat: "mind", substat: "focus" },
    { id: "quest41", label: "Cook a Homemade Meal", xp: 25, category: "Healthy Life Choices", stat: "body", substat: "strength" },
    { id: "quest42", label: "Complete a Full 20 Minute Workout", xp: 25, category: "Healthy Life Choices", stat: "body", substat: "strength" },
    { id: "quest43", label: "Drink Water Before Every Meal", xp: 25, category: "Healthy Life Choices", stat: "body", substat: "endurance" },
    { id: "quest44", label: "Journal One Healthy Choice You Made", xp: 25, category: "Healthy Life Choices", stat: "spirit", substat: "gratitude" },
    { id: "quest45", label: "Take a Calm Evening Wind-Down Break", xp: 25, category: "Healthy Life Choices", stat: "spirit", substat: "purpose" },
    { id: "quest46", label: "Try a New Healthy Recipe", xp: 25, category: "Healthy Life Choices", stat: "mind", substat: "learning" },
    { id: "quest47", label: "Complete a Full Day of Healthy Eating", xp: 30, category: "Healthy Life Choices", stat: "body", substat: "strength" },
    { id: "quest48", label: "Celebrate a Healthy Habit Win", xp: 30, category: "Healthy Life Choices", stat: "spirit", substat: "gratitude" }

];
const questDefinitionsById = Object.fromEntries(questDefinitions.map((quest) => [quest.id, quest]));
const questXPMap = Object.fromEntries(questDefinitions.map((quest) => [quest.id, quest.xp]));

const titleTiers = [
    { level: 1, title: "Novice Hunter" },
    { level: 5, title: "Rising Hunter" },
    { level: 10, title: "Seasoned Hunter" },
    { level: 15, title: "Awakened Hunter" },
    { level: 20, title: "Shadow Monarch" }
];

const rankTiers = [
    { level: 1, rank: "E" },
    { level: 5, rank: "D" },
    { level: 8, rank: "C" },
    { level: 12, rank: "B" },
    { level: 16, rank: "A" },
    { level: 20, rank: "S" },
    { level: 24, rank: "SS" }
];

function getTitleForLevel(currentLevel) {
    let currentTitle = titleTiers[0].title;
    for (const tier of titleTiers) {
        if (currentLevel >= tier.level) {
            currentTitle = tier.title;
        }
    }
    return currentTitle;
}

function getRankForLevel(currentLevel) {
    let currentRank = rankTiers[0].rank;
    for (const tier of rankTiers) {
        if (currentLevel >= tier.level) {
            currentRank = tier.rank;
        }
    }
    return currentRank;
}

function getToday() {
    return new Date().toDateString();
}

function getWeekKey() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + start.getDay() + 1) / 7);
    return now.getFullYear() + "-" + week;
}

const adventureEntries = [
    "A squirrel judged your posture and stole your dignity.",
    "You found a mysterious snack and called it a victory feast.",
    "The wind whispered, but your hair answered back.",
    "A tiny victory was logged: one sock successfully matched.",
    "You stared at the laundry mountain and chose bravery over folding.",
    "The quest board trembled as your ambition exceeded your energy.",
    "A heroic nap was taken. The legend grew.",
    "You outran your own excuses for exactly 12 seconds.",
    "The kitchen was conquered, though the sink remains undefeated.",
    "A dramatic stretch session was performed with zero audience.",
    "You drank water like a champion and immediately felt smug."
];

let adventureIndex = 0;
let dailyQuestIds = [];

function updateAdventureLog() {
    const logText = document.getElementById("logText");
    if (!logText) return;

    adventureIndex = (adventureIndex + 1) % adventureEntries.length;
    logText.textContent = adventureEntries[adventureIndex];
}

function getNextDailyReset() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return tomorrow;
}

function getNextWeeklyReset() {
    const now = new Date();
    const day = now.getDay();
    let daysUntilMonday = (8 - day) % 7;
    if (daysUntilMonday === 0) {
        daysUntilMonday = 7;
    }
    const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
}

function formatCountdown(milliseconds) {
    if (milliseconds < 0) {
        return "00:00:00";
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateResetTimers() {
    const dailyTimer = document.getElementById("dailyResetTimer");
    const weeklyTimer = document.getElementById("weeklyResetTimer");
    const now = new Date();

    if (dailyTimer) {
        dailyTimer.textContent = formatCountdown(getNextDailyReset() - now);
    }

    if (weeklyTimer) {
        weeklyTimer.textContent = formatCountdown(getNextWeeklyReset() - now);
    }
}

// Load saved data
let savedDate = localStorage.getItem("lastDate");
let savedXP = localStorage.getItem("xp");
let savedLevel = localStorage.getItem("level");
let savedStats = JSON.parse(localStorage.getItem("stats")) || {};
let savedSubstats = JSON.parse(localStorage.getItem("substats")) || {};
let savedQuests = JSON.parse(localStorage.getItem("quests")) || {};
let savedWeeklyQuestIds = JSON.parse(localStorage.getItem("weeklyQuestIds")) || [];
let savedWeeklyProgress = JSON.parse(localStorage.getItem("weeklyProgress")) || {};
let savedWeeklyRewards = JSON.parse(localStorage.getItem("weeklyRewards")) || {};
let savedWeekKey = localStorage.getItem("weeklyWeekKey");
let savedDailyQuestIds = JSON.parse(localStorage.getItem("dailyQuestIds")) || [];
let savedDailyQuestDate = localStorage.getItem("dailyQuestDate");
let savedPlayerName = localStorage.getItem("playerName");

// Always rebuild the daily quest list so the current settings are applied.
dailyQuestIds = generateDailyQuestSet();
if (healthyLifeQuestDate !== getToday() || !healthyLifeQuestIds.length || healthyLifeQuestIds.length !== healthyLifeQuestDailyCount) {
    healthyLifeQuestIds = generateHealthyLifeQuestSet();
    healthyLifeQuestDate = getToday();
    healthyLifeQuestPage = 0;
}
savedDailyQuestIds = dailyQuestIds;
localStorage.setItem("dailyQuestIds", JSON.stringify(dailyQuestIds));
localStorage.setItem("healthyLifeQuestIds", JSON.stringify(healthyLifeQuestIds));
localStorage.setItem("healthyLifeQuestDate", healthyLifeQuestDate);
localStorage.setItem("healthyLifeQuestPage", String(healthyLifeQuestPage));
localStorage.setItem("dailyQuestDate", getToday());

// Restore level (permanent)
level = Number(savedLevel) || 1;
Object.keys(stats).forEach((key) => {
    stats[key] = Number(savedStats[key]) || 0;
});

Object.keys(substats).forEach((mainKey) => {
    Object.keys(substats[mainKey]).forEach((subKey) => {
        substats[mainKey][subKey] = Number(savedSubstats[mainKey]?.[subKey]) || 0;
    });
});

function isValidWeeklyQuestSet(ids) {
    return Array.isArray(ids) && ids.length === 4 && ids.every((id) => weeklyQuestDefinitionsById[id]);
}

function generateWeeklyQuestSet() {
    const weekKey = getWeekKey();
    const seed = weekKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const shuffled = [...weeklyQuestPool].sort((left, right) => {
        const leftSeed = seededRandom(seed + left.id.length + left.label.length);
        const rightSeed = seededRandom(seed + right.id.length + right.label.length);
        return leftSeed - rightSeed;
    });

    const selected = [];
    const usedCategories = new Set();

    // Pick distinct category-based weekly objectives first.
    shuffled.forEach((quest) => {
        if (selected.length >= 4) return;
        if (quest.type !== "category") return;

        const overlaps = quest.categories.some((category) => usedCategories.has(category));
        if (!overlaps) {
            selected.push(quest.id);
            quest.categories.forEach((category) => usedCategories.add(category));
        }
    });

    // Add XP-based quests if there is space and one exists.
    shuffled.forEach((quest) => {
        if (selected.length >= 4) return;
        if (quest.type === "xp" && !selected.includes(quest.id)) {
            selected.push(quest.id);
        }
    });

    // Fill any remaining slots with the next available quests.
    shuffled.forEach((quest) => {
        if (selected.length >= 4) return;
        if (!selected.includes(quest.id)) {
            selected.push(quest.id);
        }
    });

    return selected;
}

const currentWeekKey = getWeekKey();
if (savedWeekKey !== currentWeekKey || !isValidWeeklyQuestSet(savedWeeklyQuestIds)) {
    weeklyQuestIds = generateWeeklyQuestSet();
    weeklyProgress = Object.fromEntries(weeklyQuestIds.map((id) => [id, 0]));
    weeklyRewards = Object.fromEntries(weeklyQuestIds.map((id) => [id, false]));
    localStorage.setItem("weeklyWeekKey", currentWeekKey);
    localStorage.setItem("weeklyQuestIds", JSON.stringify(weeklyQuestIds));
    localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
    localStorage.setItem("weeklyRewards", JSON.stringify(weeklyRewards));
} else {
    weeklyQuestIds = savedWeeklyQuestIds;
    weeklyProgress = {};
    weeklyRewards = {};
    weeklyQuestIds.forEach((id) => {
        weeklyProgress[id] = Number(savedWeeklyProgress[id]) || 0;
        weeklyRewards[id] = Boolean(savedWeeklyRewards[id]);
    });
}

// Daily reset logic
if (savedDate !== getToday()) {
    xp = 0;
    savedQuests = {};
    dailyQuestIds = generateDailyQuestSet();
    savedDailyQuestIds = dailyQuestIds;
    savedDailyQuestDate = getToday();
    localStorage.setItem("lastDate", getToday());
    localStorage.setItem("xp", xp);
    localStorage.setItem("quests", JSON.stringify(savedQuests));
    localStorage.setItem("stats", JSON.stringify(stats));
    localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
    localStorage.setItem("weeklyRewards", JSON.stringify(weeklyRewards));
    localStorage.setItem("dailyQuestIds", JSON.stringify(dailyQuestIds));
    localStorage.setItem("dailyQuestDate", savedDailyQuestDate);
} else {
    xp = Number(savedXP) || 0;
    dailyQuestIds = generateDailyQuestSet();
    savedDailyQuestIds = dailyQuestIds;
    localStorage.setItem("dailyQuestIds", JSON.stringify(dailyQuestIds));
    if (!savedDailyQuestDate) {
        savedDailyQuestDate = getToday();
        localStorage.setItem("dailyQuestDate", savedDailyQuestDate);
    }
}

if (savedPlayerName) {
    playerName = savedPlayerName;
}

attachQuestHandlers();
setupNameInput();
updateUI();
renderDailyQuests();
renderWeeklyQuests();
restoreQuestStates();
updateResetTimers();
setInterval(updateResetTimers, 1000);
setInterval(updateAdventureLog, 120000);

function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function generateHealthyLifeQuestSet() {
    const pool = questDefinitions.filter((quest) => quest.category === healthyLifeQuestCategoryName);
    const dateKey = getToday();
    const seed = dateKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return pool
        .map((quest) => ({ ...quest, seed: seededRandom(seed + quest.id.length + quest.label.length) }))
        .sort((left, right) => left.seed - right.seed)
        .slice(0, healthyLifeQuestDailyCount)
        .map((quest) => quest.id);
}

function generateDailyQuestSet() {
    const dateKey = getToday();
    const seed = dateKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

    const grouped = questDefinitions.reduce((groups, quest) => {
        if (quest.category === healthyLifeQuestCategoryName) return groups;
        if (!groups[quest.category]) {
            groups[quest.category] = [];
        }
        groups[quest.category].push(quest);
        return groups;
    }, {});

    const selected = [];
    const categories = Object.keys(grouped);

    categories.forEach((category) => {
        const shuffled = [...grouped[category]].sort((left, right) => {
            const leftSeed = seededRandom(seed + left.id.length + left.label.length + category.length);
            const rightSeed = seededRandom(seed + right.id.length + right.label.length + category.length);
            return leftSeed - rightSeed;
        });

        const categoryQuests = shuffled.slice(0, questsPerCategory).map((quest) => quest.id);
        selected.push(...categoryQuests);
    });

    return selected;
}

function isValidDailyQuestSet(ids) {
    if (!Array.isArray(ids) || ids.length !== dailyQuestCount) return false;

    const grouped = ids.reduce((groups, questId) => {
        const quest = questDefinitionsById[questId];
        if (!quest) return groups;
        if (!groups[quest.category]) {
            groups[quest.category] = 0;
        }
        groups[quest.category] += 1;
        return groups;
    }, {});

    return Object.values(grouped).every((count) => count === questsPerCategory);
}

function createQuestButton(quest) {
    const button = document.createElement("button");
    button.className = "questBtn";
    button.dataset.quest = quest.id;
    button.textContent = `${quest.label} (+${quest.xp} XP)`;
    return button;
}

function renderQuestCategory(container, categoryName, quests, displayLimit = questsPerCategory) {
    const category = document.createElement("div");
    category.className = `questCategory${categoryName === healthyLifeQuestCategoryName ? " healthy-life-choices" : ""}`;

    const title = document.createElement("h3");
    title.textContent = categoryName;
    category.appendChild(title);

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "questGrid";

    const categoryQuests = quests.slice(0, displayLimit);
    categoryQuests.forEach((quest) => {
        buttonGroup.appendChild(createQuestButton(quest));
    });

    category.appendChild(buttonGroup);
    container.appendChild(category);
}

function renderHealthyLifeQuestCategory(container) {
    const category = document.createElement("div");
    category.className = "questCategory healthy-life-choices";

    const title = document.createElement("h3");
    title.textContent = healthyLifeQuestCategoryName;
    category.appendChild(title);

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "questGrid";
    healthyLifeQuestIds
        .map((questId) => questDefinitionsById[questId])
        .filter(Boolean)
        .forEach((quest) => {
            buttonGroup.appendChild(createQuestButton(quest));
        });

    category.appendChild(buttonGroup);
    container.appendChild(category);
}

function renderDailyQuests() {
    const container = document.getElementById("dailyQuestList");
    if (!container) return;

    container.innerHTML = "";

    const questEntries = dailyQuestIds
        .map((questId) => questDefinitionsById[questId])
        .filter(Boolean);

    if (!questEntries.length) return;

    const groupedByCategory = questEntries.reduce((groups, quest) => {
        if (!groups[quest.category]) {
            groups[quest.category] = [];
        }
        groups[quest.category].push(quest);
        return groups;
    }, {});

    Object.entries(groupedByCategory).forEach(([categoryName, quests]) => {
        if (categoryName === healthyLifeQuestCategoryName) return;
        renderQuestCategory(container, categoryName, quests);
    });

    renderHealthyLifeQuestCategory(container);
    restoreQuestStates();
    localStorage.setItem("dailyQuestIds", JSON.stringify(dailyQuestIds));
    localStorage.setItem("healthyLifeQuestIds", JSON.stringify(healthyLifeQuestIds));
    localStorage.setItem("healthyLifeQuestDate", healthyLifeQuestDate);
    localStorage.setItem("healthyLifeQuestPage", String(healthyLifeQuestPage));
    localStorage.setItem("dailyQuestDate", getToday());
}

function attachQuestHandlers() {
    const container = document.getElementById("dailyQuestList");
    if (!container) return;

    container.addEventListener("click", (event) => {
        const button = event.target.closest(".questBtn");
        if (!button) return;

        completeQuest(button.dataset.quest, questXPMap[button.dataset.quest] || 0);
    });
}

function completeQuest(questId, amount) {
    if (savedQuests[questId]) return;

    const quest = questDefinitionsById[questId];
    if (!quest) return;

    addXP(amount);

    stats[quest.stat] += 1;
    substats[quest.stat][quest.substat] += 1;

    savedQuests[questId] = true;
    updateWeeklyProgressForQuest(quest, amount);

    saveData();
    updateUI();
    updateQuestUI(questId);
}

function getXPThreshold() {
    return level * 100;
}

function addXP(amount) {
    xp += amount;

    while (xp >= getXPThreshold()) {
        xp -= getXPThreshold();
        level += 1;
    }
}

function updateWeeklyProgressForQuest(quest, amount) {
    weeklyQuestIds.forEach((weeklyId) => {
        const weeklyQuest = weeklyQuestDefinitionsById[weeklyId];
        if (!weeklyQuest) return;

        if (weeklyQuest.type === "category" && weeklyQuest.categories.includes(quest.category)) {
            weeklyProgress[weeklyId] += 1;
        }

        if (weeklyQuest.type === "xp") {
            weeklyProgress[weeklyId] += amount;
        }

        awardWeeklyReward(weeklyId);
    });
}

function renderWeeklyQuests() {
    const container = document.getElementById("weeklyQuestList");
    if (!container) return;

    container.innerHTML = "";

    weeklyQuestIds.forEach((weeklyId) => {
        const weeklyQuest = weeklyQuestDefinitionsById[weeklyId];
        const weeklyDiv = document.createElement("div");
        weeklyDiv.className = "weeklyQuest";
        weeklyDiv.innerHTML = `
            <strong>${weeklyQuest.label}</strong>
            <div class="weeklyBar">
                <div id="weeklyProgress-${weeklyId}" class="weeklyProgress"></div>
            </div>
            <span id="weeklyCount-${weeklyId}">0 / ${weeklyQuest.goal}</span>
            <div class="weeklyReward">Reward: +${weeklyRewardAmount} XP</div>
            <div id="weeklyStatus-${weeklyId}" class="weeklyStatus">In progress</div>
        `;
        container.appendChild(weeklyDiv);
    });
}

function awardWeeklyReward(key) {
    if (weeklyRewards[key]) return;

    const weeklyQuest = weeklyQuestDefinitionsById[key];
    if (!weeklyQuest) return;

    if (weeklyProgress[key] >= weeklyQuest.goal) {
        addXP(weeklyRewardAmount);
        weeklyRewards[key] = true;
    }
}

function updateQuestUI(questId) {
    let button = document.querySelector(`.questBtn[data-quest="${questId}"]`);

    if (!button) return;

    button.disabled = true;
    button.style.opacity = "0.5";
    if (!button.textContent.includes("✓ Completed")) {
        button.textContent += " ✓ Completed";
    }
}

function restoreQuestStates() {
    for (let questId in savedQuests) {
        if (savedQuests[questId]) {
            let button = document.querySelector(`.questBtn[data-quest="${questId}"]`);
            if (button) {
                button.disabled = true;
                button.style.opacity = "0.5";
                if (!button.textContent.includes("✓ Completed")) {
                    button.textContent += " ✓ Completed";
                }
            }
        }
    }
}

function getDailySummaryData() {
    const completedToday = Object.values(savedQuests).filter(Boolean).length;
    const streakDays = Number(localStorage.getItem("questStreak")) || 0;
    const highPriorityQuest = questDefinitions
        .filter((quest) => !savedQuests[quest.id])
        .sort((left, right) => right.xp - left.xp)[0];

    return {
        streakDays,
        priorityFocus: completedToday >= 1 ? "Keep your momentum going" : "Start with your first daily quest",
        highPriorityQuest: highPriorityQuest ? `${highPriorityQuest.label} (+${highPriorityQuest.xp} XP)` : "None today"
    };
}

function updateUI() {
    document.getElementById("xpDisplay").textContent = xp;
    document.getElementById("xpMaxDisplay").textContent = getXPThreshold();
    document.getElementById("levelDisplay").textContent = level;
    document.getElementById("rankDisplay").textContent = getRankForLevel(level);
    document.getElementById("titleDisplay").textContent = getTitleForLevel(level);
    document.getElementById("playerNameDisplay").textContent = playerName;
    document.getElementById("bodyDisplay").textContent = stats.body;
    document.getElementById("mindDisplay").textContent = stats.mind;
    document.getElementById("socialDisplay").textContent = stats.social;
    document.getElementById("wealthDisplay").textContent = stats.wealth;
    document.getElementById("spiritDisplay").textContent = stats.spirit;
    document.getElementById("creativityDisplay").textContent = stats.creativity;

    document.getElementById("bodyStrengthDisplay").textContent = substats.body.strength;
    document.getElementById("bodyEnduranceDisplay").textContent = substats.body.endurance;
    document.getElementById("bodyAgilityDisplay").textContent = substats.body.agility;
    document.getElementById("mindFocusDisplay").textContent = substats.mind.focus;
    document.getElementById("mindLearningDisplay").textContent = substats.mind.learning;
    document.getElementById("mindDisciplineDisplay").textContent = substats.mind.discipline;
    document.getElementById("socialCharismaDisplay").textContent = substats.social.charisma;
    document.getElementById("socialEmpathyDisplay").textContent = substats.social.empathy;
    document.getElementById("socialTeamworkDisplay").textContent = substats.social.teamwork;
    document.getElementById("wealthSavingDisplay").textContent = substats.wealth.saving;
    document.getElementById("wealthCareerDisplay").textContent = substats.wealth.career;
    document.getElementById("wealthInvestingDisplay").textContent = substats.wealth.investing;
    document.getElementById("spiritMeditationDisplay").textContent = substats.spirit.meditation;
    document.getElementById("spiritGratitudeDisplay").textContent = substats.spirit.gratitude;
    document.getElementById("spiritPurposeDisplay").textContent = substats.spirit.purpose;
    document.getElementById("creativityImaginationDisplay").textContent = substats.creativity.imagination;
    document.getElementById("creativityExpressionDisplay").textContent = substats.creativity.expression;
    document.getElementById("creativityInnovationDisplay").textContent = substats.creativity.innovation;

    const xpPercentage = Math.min((xp / getXPThreshold()) * 100, 100);
    document.getElementById("xpBar").style.width = xpPercentage + "%";

    const dailySummary = getDailySummaryData();
    document.getElementById("questStreakDisplay").textContent = `${dailySummary.streakDays} days`;
    document.getElementById("priorityFocusDisplay").textContent = dailySummary.priorityFocus;
    document.getElementById("highPriorityQuestDisplay").textContent = dailySummary.highPriorityQuest;

    weeklyQuestIds.forEach((weeklyId) => {
        const weeklyQuest = weeklyQuestDefinitionsById[weeklyId];
        updateWeeklyQuestUI(
            `weeklyProgress-${weeklyId}`,
            `weeklyCount-${weeklyId}`,
            `weeklyStatus-${weeklyId}`,
            weeklyProgress[weeklyId],
            weeklyQuest.goal,
            weeklyRewards[weeklyId]
        );
    });
}

function setupNameInput() {
    const input = document.getElementById("playerNameInput");
    const icon = document.getElementById("accountIcon");
    const popup = document.getElementById("accountPopup");
    const closeButton = document.getElementById("closeAccountPopup");

    if (input) {
        input.value = playerName;
        input.addEventListener("input", (event) => {
            playerName = event.target.value.trim() || "Hunter";
            localStorage.setItem("playerName", playerName);
            document.getElementById("playerNameDisplay").textContent = playerName;
        });
    }

    if (icon && popup) {
        icon.addEventListener("click", () => {
            popup.classList.toggle("open");
            if (popup.classList.contains("open") && input) {
                input.focus();
            }
        });
    }

    if (closeButton && popup) {
        closeButton.addEventListener("click", () => {
            popup.classList.remove("open");
        });
    }
}

function updateWeeklyQuestUI(barId, countId, statusId, current, goal, completed) {
    const bar = document.getElementById(barId);
    const count = document.getElementById(countId);
    const status = document.getElementById(statusId);

    if (bar) {
        const percentage = Math.min((current / goal) * 100, 100);
        bar.style.width = percentage + "%";
    }

    if (count) {
        count.textContent = current + " / " + goal;
    }

    if (status) {
        status.textContent = completed ? "Completed — +100 XP earned" : current >= goal ? "Reward ready" : "In progress";
    }
}

function saveData() {
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("stats", JSON.stringify(stats));
    localStorage.setItem("substats", JSON.stringify(substats));
    localStorage.setItem("quests", JSON.stringify(savedQuests));
    localStorage.setItem("weeklyQuestIds", JSON.stringify(weeklyQuestIds));
    localStorage.setItem("weeklyProgress", JSON.stringify(weeklyProgress));
    localStorage.setItem("weeklyRewards", JSON.stringify(weeklyRewards));
    localStorage.setItem("weeklyWeekKey", getWeekKey());
    localStorage.setItem("playerName", playerName);
}