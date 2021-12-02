const db = require('quick.db');
module.exports = {
    name: "fixtts",
    aliases: ['fix'],
    category: 'tts',
    description: 'Fix lỗi Có người khác đang sử dụng bot',
    usage: '<PREIFX>fixtts hoặc <PREFIX>fix',
    run: async (client, message, args) => {
        await db.set(`${message.guild.id}.botdangnoi`, false);
        message.react('✅');
    },
};