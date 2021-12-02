const ms = require('ms');
const ga = require('../../functions/giveaway');
module.exports = {
    name: 'startgiveaway',
    aliases: ['start', 'startga'],
    category: 'giveaway',
    description: 'Bắt đầu Giveaway',
    usage: '<PREFIX>start <thời gian GA(10s, 20m, 1d)> <số người thắng> <phần thưởng>',
    example: '<PREFIX>start 1d 1 100000 agent money',
    run: async (client, message, args, guildData) => {
        const userRoles = message.member.roles.cache.map(r => r.name.toLowerCase());
        if (!message.member.hasPermission('MANAGE_CHANNELS') && !userRoles.includes('giveaway')) return message.reply("Bạn không có quyền `MANAGE_CHANNELS`");
        if (!args[0] || !args[1] || !args[2]) return message.channel.send(`Bạn hãy nhập đủ dữ liệu cho bot đi!\n\n**TIP:** Sử dụng lệnh \`${guildData.prefix}help start\` để biết cách sử dụng!`);
        if (message.deletable) message.delete();
        client.giveawaysManager.start(message.channel, {
            time: ms(args[0]),
            winnerCount: parseInt(args[1]),
            prize: args.slice(2).join(' '),
            messages: ga.message,
            hostedBy: message.author.id,
        });
    },
};