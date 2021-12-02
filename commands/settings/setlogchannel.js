const { getChannel } = require('../../functions/utils');
const db = require('quick.db');
module.exports = {
    name: "setlogchannel",
    category: "settings",
    description: "Set log channel for kick and ban",
    usage: "<PREFIX>setlogchannel <#channel, tên channel hoặc id>",
    example: "<PREFIX>setlogchannel #log-channel",
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply('Bạn cần có quyền `MANAGE_GUILD` để chạy lệnh này.');
        if (!args[0]) return message.channel.send("Vui lòng nhập channel!");
        const channel = await getChannel(message, args.join(' '), true);
        if (!channel) return message.channel.send('Không tìm thấy channel!');
        // log to database
        await db.set(`${message.guild.id}.logchannel`, channel.id);
        message.channel.send(`Đã lưu ${channel} vào log channel!`);
    },
};