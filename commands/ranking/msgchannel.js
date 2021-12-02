const db = require('quick.db');
const { getChannel } = require('../../functions/utils');
module.exports = {
    name: 'msgchannel',
    category: 'ranking',
    description: 'Tắt/Mở phòng tính điểm rank',
    usage: '<PREFIX>msgchannel <#channel>',
    example: '<PREIFX>msgchannel #welcome',
    run: async (client, message, args, serverData) => {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply('Bạn cần có quyền MANAGE_GUILD để chạy lệnh này!');
        const { msgChannelOff } = serverData;
        if (!args[0]) {
            if (msgChannelOff.length === 0) return message.channel.send('Server không có phòng nào đang tắt tính exp!');
            const channels = [];
            msgChannelOff.forEach(id => {
                const channel = message.guild.channels.cache.get(id);
                if (channel) channels.push(channel);
            });
            return message.channel.send(`Những phòng đang tắt tính kinh nghiệm là: ${channels.join(' ')}`);
        }
        const channel = await getChannel(message, args.join(' '), true);
        if (!channel) return message.channel.send('Không tìm thấy channel!');
        // check
        if (msgChannelOff.includes(channel.id)) {
            msgChannelOff.filter(ch => ch !== channel.id);
            await db.set(`${message.guild.id}.msgChannelOff`, msgChannelOff);
            message.channel.send(`✅ Đã bật ${channel} thành channel tính kinh nghiệm!`);
        } else {
            // log to database
            await db.push(`${message.guild.id}.msgChannelOff`, channel.id);
            message.channel.send(`✅ Đã tắt ${channel} trong list channel tính kinh nghiệm!`);
        }
    },
};