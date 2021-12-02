const { getChannel, updateNoiTu } = require('../../functions/utils');
const { set, has } = require('quick.db');
module.exports = {
    name: 'noichu',
    aliases: ['setnoichu', 'wordchannel', 'setwordchannel'],
    description: 'Set channel dùng để chơi nối chữ',
    category: 'noichu',
    usage: '<PREFIX>noichu <#channel>',
    run: async (client, message, args, guildData) => {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply('Bạn cần có quyền `MANAGE_GUILD` để chạy lệnh này!');
        if (!has(`${message.guild.id}.noitu`)) await set(`${message.guild.id}.noitu`, null);
        const channel = await getChannel(message, args.join(' '), false);
        if (!channel) return message.channel.send('Không tìm thấy channel, vui lòng thử lại sau!');
        if (channel.id == guildData.aiChannel) return message.channel.send('Channel không thể trùng với AI channel!');
        if (channel.id == guildData.noitu || message.guild.channels.cache.get(guildData.noitu)) {
            await updateNoiTu(message.guild.id, guildData.maxWords);
            return message.channel.send(`Đã xoá phòng ${channel}`);
        }
        await set(`${message.guild.id}.noitu`, channel.id);
        message.channel.send('✅ | Thao tác thành công!');
        channel.send('Trò chơi bắt đầu! Vui lòng nhập 1 từ bất kỳ!');
    },
};