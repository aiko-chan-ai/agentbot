const { set } = require('quick.db');
module.exports = {
    name: 'setmaxword',
    aliases: ['maxword', 'maxwords', 'setmaxwords'],
    category: 'noichu',
    description: 'Set số lần nối chữ tối đa trong 1 game',
    usage: '<PREFIX>setmaxword <số>',
    run: async (client, message, args, guildData) => {
        const query = parseInt(args[0]);
        if (!query) return message.reply(`Số chữ tối đa hiện tại để kết thúc game: ${guildData.maxWords}`);
        if (query < 200) return message.reply('Số lần tối đa không được dưới 200 lần!');
        await set(`${message.guild.id}.maxWords`, query);
        message.channel.send('✅ | Thao tác thành công!');
    },
};