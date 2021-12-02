const db = require('quick.db');
const command = new db.table('disable');
module.exports = {
    name: 'enable',
    category: 'settings',
    aliases: ['molenh'],
    description: 'Mở 1 lệnh nào đó trong server',
    usage: '<PREFIX>enable <tên lệnh, tên category>',
    run: async (client, message, args) => {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply('Bạn cần có quyền MANAGE_GUILD để chạy lệnh này!');
        if (!command.has(message.guild.id)) return message.channel.send('Bạn chưa có tắt lệnh nào!');
        let guildDisable = await command.get(message.guild.id);
        if (!args[0]) return message.channel.send("Vui lòng nhập lệnh hoặc nhóm chủ đề");
        const query = args[0].toLowerCase();
        if (query == 'disable' || query == 'enable') return message.channel.send('Bạn không thể mở lệnh này!');
        const listCommand = client.commands.map(el => el.name);
        const category = [... new Set(client.commands.map(el => el.category))].filter(el => el != null);
        if (category.includes(query)) {
            const goToEnable = client.commands.filter(el => el.category == query).map(el => el.name);
            guildDisable = guildDisable.filter(el => !goToEnable.includes(el));
        }
        else if (listCommand.includes(query)) guildDisable = guildDisable.filter(el => el !== query);
        else return message.channel.send('Vui lòng nhập lệnh hoặc chủ đề!');
        await command.set(message.guild.id, [...new Set(guildDisable)]);
        message.channel.send('✅ | Thao tác thành công!');
    },
};