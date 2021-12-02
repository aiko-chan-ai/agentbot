const db = require('quick.db');
const { getChannel } = require('../../functions/utils');
module.exports = {
    name: 'setaichannel',
    category: 'settings',
    aliases: ['aichannel', 'ai'],
    description: 'Set channel cho bot AI nói chuyện',
    usage: '<PREFIX>setaichannel <#channel>',
    run: async (client, message, args, serverData) => {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply('Bạn cần có quyền MANAGE_GUILD để chạy lệnh này.');
        const channel = await getChannel(message, args.join(' '), false);
        if (!channel) return message.channel.send('Không tìm thấy channel, vui lòng thử lại sau!');
        // check in db
        const { aiChannel: aiChannelID } = serverData;
        if (aiChannelID == channel.id) {
            await db.set(`${message.guild.id}.aiChannel`, null);
            message.channel.send(`Đã xoá ${channel}!`);
        } else {
            // log to database
            await db.set(`${message.guild.id}.aiChannel`, channel.id);
            message.channel.send(`Đã lưu ${channel} vào AI channel!`);
        }
    },
};