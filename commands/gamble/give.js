const eco = require('../../functions/economy');
const { laysodep, getMember } = require('../../functions/utils');
module.exports = {
    name: 'give',
    category: 'gamble',
    aliases: ['transfer'],
    description: 'Chuyển tiền cho người khác!',
    usage: '<PREFIX>give <@tag or ID> <so tien>',
    example: '<PREFIX>give @phamleduy04 50000',
    run: async (client, message, args) => {
        const member = await getMember(message, args[0], false);
        if (!member) return message.channel.send('Hãy tag hoặc đưa ID của người đó!');
        if (member.user.bot) return message.channel.send('Bạn không thể gởi tiền cho bot!');
        const amount = await eco.fetchMoney(message.author.id);
        if (message.author.id == member.id) return message.channel.send('Bạn không thể tự chuyển tiền cho chính mình!');
        const soTienChuyen = parseInt(args[1]);
        if (!soTienChuyen) return message.channel.send('Hãy nhập số tiền cần chuyển.');
        if (soTienChuyen < 0) return message.channel.send('Bạn không thể chuyển tiền dưới 0');
        if (amount < soTienChuyen) return message.channel.send('Bạn không đủ tiền để chuyển');
        await eco.addMoney(member.id, soTienChuyen);
        await eco.subtractMoney(message.author.id, soTienChuyen);
        return message.channel.send(`Bạn đã chuyển thành công **${laysodep(soTienChuyen)}** tiền tới **${member.user.tag}**.`);
    },
};