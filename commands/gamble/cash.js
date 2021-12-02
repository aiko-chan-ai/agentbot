const eco = require('../../functions/economy');
const { laysodep } = require('../../functions/utils');

module.exports = {
    name: "cash",
    cooldown: 5,
    category: 'gamble',
    aliases: ["balance", "bal"],
    description: "Xem tiền hiện tại có trong tài khoản",
    usage: "<PREFIX>cash",
    run: async (client, message, args) => {
        const money = await eco.fetchMoney(message.author.id);
        message.channel.send(`<a:money:703041038637334540> Bạn đang có **${laysodep(money)}** tiền!`);
    },
};