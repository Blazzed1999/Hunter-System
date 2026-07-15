const accountListStorageKey = "hunterAccountList";
const activeAccountStorageKey = "activeHunterAccountId";
const accountDataStoragePrefix = "hunterAccountData:";

function createBlankAccountState(playerNameValue = "Hunter") {
    return {
        playerName: playerNameValue,
        xp: 0,
        level: 1,

        stats: {
            body:0,
            mind:0,
            social:0,
            wealth:0,
            spirit:0,
            creativity:0
        },

        substats:{
            body:{strength:0,endurance:0,agility:0},
            mind:{focus:0,learning:0,discipline:0},
            social:{charisma:0,empathy:0,teamwork:0},
            wealth:{saving:0,career:0,investing:0},
            spirit:{meditation:0,gratitude:0,purpose:0},
            creativity:{imagination:0,expression:0,innovation:0}
        },

        quests:{},
        weeklyQuestIds:[],
        weeklyProgress:{},
        weeklyRewards:{},

        weeklyWeekKey:"",
        lastDate:"",

        dailyQuestIds:[],
        dailyQuestDate:"",

        healthyLifeQuestIds:[],
        healthyLifeQuestPage:0,
        healthyLifeQuestDate:"",

        questStreak:0
    };
}

function getAccountStorageKey(accountId){
    return `${accountDataStoragePrefix}${accountId}`;
}


function createAccount(name="Hunter"){

    const trimmedName =
        (name || "Hunter").trim() || "Hunter";


    let finalName = trimmedName;
    let suffix = 2;


    let accounts =
        JSON.parse(localStorage.getItem(accountListStorageKey))
        || [];


    while(
        accounts.some(
            a=>a.name.toLowerCase()===finalName.toLowerCase()
        )
    ){
        finalName = `${trimmedName} ${suffix}`;
        suffix++;
    }


    const account={

        id:
        `account-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

        name:finalName
    };


    accounts.push(account);


    localStorage.setItem(
        accountListStorageKey,
        JSON.stringify(accounts)
    );


    localStorage.setItem(
        getAccountStorageKey(account.id),
        JSON.stringify(
            createBlankAccountState(finalName)
        )
    );


    return account;
}

const button =
document.getElementById("createAccountButton");


button.onclick = ()=>{

    const name =
    document.getElementById("playerNameInput").value;


    const account=createAccount(name);


    localStorage.setItem(
        activeAccountStorageKey,
        account.id
    );


    window.location.href="index.html";
};

