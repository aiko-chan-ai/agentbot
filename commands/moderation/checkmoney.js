const eco = require('../../functions/economy');
const { laysodep, getMember } = require('../../functions/utils');
module.exports = {
    name: 'checkmoney',
    aliases: ['cmoney'],
    description: 'Kiểm tra tiền của người khác',
    ownerOnly: true,
    run: async (client, message, args) => {
        const member = await getMember(message, args.join(' '), false);
        const amount = await eco.fetchMoney(member.id);
        message.channel.send(`\`${laysodep(amount)}\``);
    },
};