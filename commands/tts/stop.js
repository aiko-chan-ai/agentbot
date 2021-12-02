const { ownerID } = require('../../config.json');
const db = require('quick.db');
module.exports = {
    name: 'stop',
    aliases: ['pause'],
    category: 'tts',
    description: 'Dừng ngay lệnh tts',
    usage: '<PREFIX>stop',
    run: async (client, message, args) => {
        const voiceChannel = message.member.voice.channel;
        if (message.author.id !== ownerID && !voiceChannel) return message.channel.send('Bạn phải vào voice mới có thể sử dụng lệnh này!');
        if (!voiceChannel.members.get(client.user.id)) return message.channel.send('Bot không ở chung phòng với bạn!');
        const dispatcher = message.guild.me.voice.connection.dispatcher;
        if (dispatcher) await dispatcher.destroy();
        message.react('✅');
        await db.set(`${message.guild.id}.botdangnoi`, false);
        if (client.ttsTimeout.has(message.guild.id)) clearTimeout(client.ttsTimeout.get(message.guild.id));
    },
};