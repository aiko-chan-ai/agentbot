const { ShardingManager } = require('discord.js');
require("dotenv").config();
const { TOKEN, TOPGG } = process.env;
const { laysodep } = require('./functions/utils');
const db = require('quick.db');
const AutoPoster = require('topgg-autoposter');
const manager = new ShardingManager('./bot.js', {
    totalShards: 'auto',
    token: TOKEN,
});

manager.spawn().then(async () => {
    const poster = AutoPoster(TOPGG, manager);

    poster.on('posted', () => {
        console.log('Posted stats to top.gg');
    });
    let guildCount = await getGuildCount();
    manager.broadcastEval(`this.user.setPresence({ status: "online", activity: { name: 'Đang phục vụ ${laysodep(guildCount)} servers', type: 'PLAYING' } })`);
    setInterval(async () => {
        guildCount = await getGuildCount();
        manager.broadcastEval(`this.user.setPresence({ status: "online", activity: { name: 'Đang phục vụ ${laysodep(guildCount)} servers', type: 'PLAYING' } })`);
    }, 36e5);
});

// change all voice status to default
const allDb = db.all();
for (let i = 0; i < allDb.length; i++) {
    try {
        const guild = allDb[i].ID;
        db.set(`${guild}.botdangnoi`, false);
    }
    catch(e) {
        continue;
    }
}

console.log('botdangnoi reseted!');

async function getGuildCount() {
    const arr = await manager.fetchClientValues('guilds.cache.size');
    return arr.reduce((p, n) => p + n, 0);
}