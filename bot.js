const { Collection, Client } = require("discord.js");
require("dotenv").config();
const { TYPE_RUN, TOKEN } = process.env;
const fs = require("fs");
const client = new Client({ disableMentions: "everyone", retryLimit: 5, ws: { intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_EMOJIS", "GUILD_VOICE_STATES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS" ] } });
const { ownerID } = require('./config.json');
const { GiveawaysManager } = require('discord-giveaways');
if (!TYPE_RUN) throw new Error("Chạy lệnh npm run dev hoặc npm run build");

// load trước ~1mb
require('./assets/json/words_dictionary.json');

const giveawayManagerShard = class extends GiveawaysManager {
    async refreshStorage() {
        return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
    };
};

const giveawayManager = new giveawayManagerShard(client, {
    storage: './assets/json/giveaways.json',
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        embedColor: '#FF0000',
        reaction: '🎉',
    },
});

client.commands = new Collection();
client.aliases = new Collection();
client.giveawaysManager = giveawayManager;
client.snipes = new Map();
client.categories = fs.readdirSync("./commands/");
client.ttsTimeout = new Map();

["command", "event"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

process.on('warning', (warn) => {
    if (warn.message.includes("Missing Permissions")) return;
    console.warn(warn);
    sendOwner(`Warning: ${warn.message}`);
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

process.on('exit', (exitCode) => {
    if (TYPE_RUN !== 'production') return console.log('Exiting......');
    sendOwner(`Bot đã thoát với exitCode: ${exitCode}`);
});

async function sendOwner(content) {
    if (!content || TYPE_RUN !== 'production') return;
    const owner = await client.users.fetch(ownerID);
    owner.send(content, { split: true, code: true });
}

if (TYPE_RUN == 'ci') process.exit(0);
client.login(TOKEN);
