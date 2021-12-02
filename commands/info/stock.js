const { getSymbol } = require('yahoo-stock-api');
const { MessageEmbed } = require('discord.js');
const { laysodep } = require('../../functions/utils');
module.exports = {
    name: 'stock',
    category: 'info',
    description: 'Lấy thông tin cổ phiếu (US)',
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send('Vui lòng nhập mã cổ phiếu cần tra!');
        const { currency, response } = await getSymbol(args[0]);
        if (!response) return message.channel.send('Mã cổ phiếu không tồn tại!');
        const { open, previousClose, marketCap, fiftyTwoWeekRange } = response;
        const embed = new MessageEmbed()
            .setTitle(`Thông tin cổ phiếu ${args[0].toUpperCase()}`)
            .addField('Open: ', open, true)
            .addField('Market cap', laysodep(marketCap), true)
            .addField('52 Week Range', fiftyTwoWeekRange, true)
            .addField('Previous Close Pirce: ', previousClose, true)
            .setFooter(`Đơn vị tiền tệ: ${currency}`);
        message.channel.send(embed);
    },
};