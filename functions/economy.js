const { Database } = require('quickmongo');
const db = new Database(process.env.MONGODB || "mongodb://localhost/economy");

module.exports = {
    addMoney: async function(userID, value) {
        if(!userID) throw new Error('You are missing the userID!');
        if(!value) throw new Error('You are missing the value!');
        if((isNaN(value))) throw new Error('Value must be a number!');
        const money = await db.fetch(`money_${userID}`);
        if (money === null) await db.set(userID, 0);
        return await db.add(`money_${userID}`, value);
    },

    setMoney: async function(userID, value) {
        if(!userID) throw new Error('You are missing the userID!');
        if(!value) throw new Error('You are missing the value!');
        return await db.set(`money_${userID}`, parseInt(value));
    },

    fetchMoney: async function(userID) {
        if(!userID) throw new Error('You are missing the userID!');
        let money = await db.fetch(`money_${userID}`);
        if (money === null) money = 0;
        return money;
    },

    subtractMoney: async function(userID, value) {
        if(!userID) throw new Error('You are missing the userID!');
        if(!value) throw new Error('You are missing the value!');
        if((isNaN(value))) throw new Error('Value must be a number!');
        const money = await db.fetch(`money_${userID}`);
        if (money === null) await db.set(`money_${userID}`, 0);
        return await db.subtract(`money_${userID}`, parseInt(value));
    },

    leaderBoard: async function() {
        return await db.startsWith("money_", { sort: ".data" });
    },

    reset: async function(userID) {
        if(!userID) throw new Error('You are missing the userID!');
        return await db.set(`money_${userID}`, 0);
    },

    getPing: async function() {
        return db.fetchLatency();
    },
};