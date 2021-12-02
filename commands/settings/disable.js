const db = require('quick.db');
const command = new db.table('disable');
module.exports = {
    name: 'disable',
    category: 'settings',
    aliases: ['tatlenh'],
    description: 'Tắt 1 lệnh nào đó trong server',
    usage: '<PREFIX>disable <tên lệnh, tên category>',
    run: async (client, message, args) => {
        if(!message.member.hasPermission("MANAGE_GUILD")) return message.reply('Bạn cần có quyền `MANAGE_GUILD` để chạy lệnh này!');
        if (!args[0]) return message.channel.send("Vui lòng nhập lệnh hoặc nhóm chủ đề");
        let guildDisable = await command.get(message.guild.id);
        if (!guildDisable) guildDisable = await command.set(message.guild.id, []);
        const query = args[0].toLowerCase();
        if (query == 'disable' || query == 'enable') return message.channel.send('Bạn không thể tắt lệnh này!');
        if (guildDisable.includes(query)) return message.channel.send('Bạn đã disable lệnh này rồi');
        const listCommand = client.commands.filter(el => el.category == 'settings').map(el => el.name);
        const category = [... new Set(client.commands.map(el => el.category))].filter(el => el != null);
        if (category.includes(query)) {
            if (query.toLowerCase() == 'settings') return message.channel.send('Bạn không thể disbale category này!');
            const goToDisable = client.commands.filter(el => el.category == query).map(el => el.name);
            goToDisable.forEach(async cmd => {
                guildDisable.push(cmd);
            });
            await command.set(message.guild.id, [...new Set(guildDisable)]);
        }
        else if (listCommand.includes(query)) await command.push(message.guild.id, query);
        else return message.channel.send('Vui lòng nhập lệnh hoặc chủ đề!');
        message.channel.send('✅ | Thao tác thành công!');
    },
};