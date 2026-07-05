const accountListStorageKey = "hunterAccountList";
const activeAccountStorageKey = "activeHunterAccountId";
const accountDataStoragePrefix = "hunterAccountData:";
const authMessage = document.getElementById("authMessage");

function getAccountStorageKey(accountId) {
    return `${accountDataStoragePrefix}${accountId}`;
}

function readAccounts() {
    try {
        return JSON.parse(localStorage.getItem(accountListStorageKey) || "[]") || [];
    } catch (error) {
        return [];
    }
}

function writeAccounts(accounts) {
    localStorage.setItem(accountListStorageKey, JSON.stringify(accounts));
}

function createAccount(name, password) {
    const trimmedName = (name || "").trim();
    const trimmedPassword = (password || "").trim();
    if (!trimmedName || !trimmedPassword) {
        throw new Error("Both a hunter name and password are required.");
    }

    const accounts = readAccounts();
    const duplicate = accounts.some((account) => account.name.toLowerCase() === trimmedName.toLowerCase());
    if (duplicate) {
        throw new Error("That hunter name is already taken.");
    }

    const account = {
        id: `account-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: trimmedName,
        password: trimmedPassword
    };

    accounts.push(account);
    writeAccounts(accounts);
    localStorage.setItem(getAccountStorageKey(account.id), JSON.stringify(createBlankAccountState(trimmedName)));
    return account;
}

function createBlankAccountState(playerNameValue = "Hunter") {
    return {
        playerName: playerNameValue,
        xp: 0,
        level: 1,
        stats: {
            body: 0,
            mind: 0,
            social: 0,
            wealth: 0,
            spirit: 0,
            creativity: 0
        },
        substats: {
            body: { strength: 0, endurance: 0, agility: 0 },
            mind: { focus: 0, learning: 0, discipline: 0 },
            social: { charisma: 0, empathy: 0, teamwork: 0 },
            wealth: { saving: 0, career: 0, investing: 0 },
            spirit: { meditation: 0, gratitude: 0, purpose: 0 },
            creativity: { imagination: 0, expression: 0, innovation: 0 }
        },
        quests: {},
        weeklyQuestIds: [],
        weeklyProgress: {},
        weeklyRewards: {},
        weeklyWeekKey: "",
        lastDate: "",
        dailyQuestIds: [],
        dailyQuestDate: "",
        healthyLifeQuestIds: [],
        healthyLifeQuestPage: 0,
        healthyLifeQuestDate: "",
        questStreak: 0
    };
}

function showMessage(text, isError = false) {
    authMessage.textContent = text;
    authMessage.style.color = isError ? "#ff8d8d" : "#8ce8d4";
}

function authenticate(name, password) {
    const accounts = readAccounts();
    const account = accounts.find((entry) => entry.name.toLowerCase() === name.trim().toLowerCase());
    if (!account) {
        throw new Error("No hunter account matches that name.");
    }
    if (account.password !== password) {
        throw new Error("Incorrect password.");
    }
    localStorage.setItem(activeAccountStorageKey, account.id);
    return account;
}

function redirectToGame() {
    window.location.href = "index.html";
}

document.getElementById("signInForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("loginName").value;
    const password = document.getElementById("loginPassword").value;

    try {
        authenticate(name, password);
        showMessage("Welcome back, hunter.");
        redirectToGame();
    } catch (error) {
        showMessage(error.message, true);
    }
});

document.getElementById("createAccountForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("createName").value;
    const password = document.getElementById("createPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    try {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }

        const account = createAccount(name, password);
        localStorage.setItem(activeAccountStorageKey, account.id);
        showMessage(`Hunter ${account.name} created. Welcome aboard.`);
        redirectToGame();
    } catch (error) {
        showMessage(error.message, true);
    }
});
