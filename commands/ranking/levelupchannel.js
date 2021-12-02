const db = require('quick.db');
const { getChannel } = require('../../functions/utils');
module.exports = {
    name: 'levelupchannel',
    aliases: ['levelup', 'lvlupchannel'],
    category: 'ranking',
    description: 'tuỳ chỉnh channel bot gởi tin nhắn khi người dùng lên cấp',
    usage: '<PREFIX>levelupchannel <#channel | none | reset>',
    note: 'none = tắt tin nhắn khi lên cấp\nreset = khôi phục mặc định',
    cooldown: 30,
    run: async (client, message, args) => {
        const query = args[0] ? args[0].toLowerCase() : null;
        if (query == 'none') await db.set(`${message.guild.id}.rankChannel`, null);
        else if (query == 'reset') await db.set(`${message.guild.id}.rankChannel`, 'default');
        else {
            const channel = await getChannel(message, args.join(' '), true);
            await db.set(`${message.guild.id}.rankChannel`, channel.id);
        }
        message.channel.send('✅ | Thao tác thành công!');
    },
};