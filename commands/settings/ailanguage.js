const db = require('quick.db');
const ansAccept = ['en', 'vi'];
module.exports = {
    name: 'ailanguage',
    aliases: ['ailang', 'ngonnguai', 'setailang'],
    description: 'Thay đổi ngôn ngữ AI',
    category: 'settings',
    run: async (client, message, args, serverData) => {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply('Bạn cần có quyền `MANAGE_GUILD` để chạy lệnh này!');
        if (!args[0] || !ansAccept.includes(args[0])) return message.channel.send('Vui lòng nhập `en` hoặc `vi` để cài đặt ngôn ngữ!');
        const { aiChannel: check } = serverData;
        if (!check) return message.channel.send('Bạn chưa cài đặt channel AI. Vui lòng sử dụng lệnh setchannelAI để sử dụng!');
        await db.set(`${message.guild.id}.aiLang`, args[0]);
        message.channel.send('✅ | Thao tác thành công!');
    },
};