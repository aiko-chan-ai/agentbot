const db = require('quick.db');
const dict = require('../../assets/json/playdata.json');
const ms = require('ms');
const { sleep } = require('../../functions/utils');
module.exports = {
    name: 'play',
    category: 'tts',
    aliases: ['p'],
    usage: '<PREFIX>p <tên>',
    run: async (client, message, args, serverData) => {
        const guildID = message.guild.id;
        const { prefix, botdangnoi: status } = serverData;
        if (status == true) return message.channel.send('Có người khác đang sử dụng bot!');
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('Bạn phải vào voice channel để sử dụng lệnh này.');
        const botPremission = voiceChannel.permissionsFor(client.user);
        if (!botPremission.has('CONNECT')) return message.channel.send('Bot không có quyền vào channel này!');
        if (!botPremission.has('SPEAK')) return message.channel.send('Bot không có quyền nói ở channel này!');
        if (!args[0] || args[0] == 'showdict') {
            const list = createArr(dict).map(e => `\`${e}\``).join(', ');
            return message.channel.send(`Lệnh: ${prefix}play <tên>\n\n${list}`);
        }
        if (!dict[args[0]]) return message.channel.send(`Tên không tồn tại! Sử dụng lệnh \`${prefix}play showdict\` để xem tất cả tên hiện có`);
        else {
            const { fileName, volume } = dict[args[0]];
            const bot = message.guild.me;
            let connection = bot.voice ? bot.voice.connection : null;
            if (!connection || bot.voice.channelID !== voiceChannel.id) {
                connection = await voiceChannel.join();
                await sleep(1000);
            }
            if (!connection) return message.channel.send('Bot không thể vào channel của bạn vào lúc này, vui lòng thử lại sau!');
            if (!message.guild.me.voice.selfDeaf) await message.guild.me.voice.setSelfDeaf(true);
            await db.set(`${guildID}.botdangnoi`, true);
            const dispatcher = connection.play(`./assets/playdata/${fileName}`, { volume: volume });
            await db.set(`${guildID}.endTime`, Date.now() + ms('1m'));
            dispatcher.on('finish', async () => {
                // dispatcher.destroy();
                await db.set(`${guildID}.botdangnoi`, false);
                if (client.ttsTimeout.has(guildID)) clearTimeout(client.ttsTimeout.get(guildID));
                const timeoutFunc = setTimeout(async () => {
                    const checkTime = await db.get(`${guildID}.endTime`);
                    if (!checkTime) return;
                    if (Date.now() > checkTime) {
                        connection.disconnect();
                        connection = null;
                        voiceChannel.leave();
                        message.channel.send('Đã rời phòng vì không hoạt động!');
                    }
                    if (!message.guild.me.voice) await db.delete(`${guildID}.endTime`);
                }, ms('1m') + 1000);
                client.ttsTimeout.set(guildID, timeoutFunc);
            });
        }
    },
};

function createArr(json) {
    if (typeof json !== 'object') return null;
    const arr = [];
    for (const key in json) arr.push(key);
    return arr;
}