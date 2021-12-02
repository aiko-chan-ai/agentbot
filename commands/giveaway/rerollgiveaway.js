const ga = require('../../functions/giveaway');
module.exports = {
    name: 'rerollgiveaway',
    category: 'giveaway',
    aliases: ['reroll', 'quaylai', 'rerollgiveaways'],
    description: 'Chọn người chiến thắng khác',
    usage: '<PREFIX>reroll <messageID>',
    run: async (client, message, args) => {
        if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.reply("Bạn không có quyền `MANAGE_CHANNELS`");
        const messageID = args[0];
        client.giveawaysManager.reroll(messageID, { messages: ga.message })
        .catch(() => {
            message.channel.send(`Không tìm thấy giveaway của bạn!`);
        });
    },
};