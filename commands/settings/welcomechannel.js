const { getChannel } = require('../../functions/utils');
const db = require('quick.db');
module.exports = {
    name: 'welcomechannel',
    category: 'settings',
    description: 'Chọn channel để bot nhắn tin nhắn chào mừng',
    usage: '<PREFIX>welcomechannel <#channel hoặc ID>',
    run: async (client, message, args, serverData) => {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply('Bạn cần có quyền MANAGE_GUILD để chạy lệnh này.');
        const { welcomechannel: check } = serverData;
        if (!args[0]) return message.channel.send("Vui lòng nhập channel!");
        const channel = await getChannel(message, args.join(' '), true);
        // log to database
        if (check == channel.id) {
            await db.delete(`${message.guild.id}.welcomechannel`);
            return message.channel.send('Đã xoá channel thành công!');
        }
        await db.set(`${message.guild.id}.welcomechannel`, channel.id);
        message.channel.send(`✅ | Thao tác thành công!`);
    },
};