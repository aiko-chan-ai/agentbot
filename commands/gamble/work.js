const { addMoney } = require('../../functions/economy');
const random = require('random-number-csprng');
const reasonList = [
    "Bạn vừa đi giật túi của người khác được {money} Agent money!",
    "Bạn đi ăn xin được bố thí {money} Agent money!",
    "Bạn đi phục vụ hộp đêm được tip {money} Agent money!",
    "Bạn đang đi trên đường thì nhặt được {money} Agent money. Bạn đã quyết định tạm thời bỏ túi luôn!",
    "Bạn vừa đòi nợ `{user}` và lấy được {money} Agent money!",
    "Bạn vừa đi đánh đề và thắng được {money} Agent money!",
    "Bạn làm bartender đi lắc nước được {money} Agent money!",
    "Bạn tạo kênh youtube được donate {money} Agent money!",
];
module.exports = {
    name: 'work',
    category: 'gamble',
    description: 'Kiếm tiền!',
    note: 'Tỉ lệ trúng 100% nhưng sẽ ít hơn sult',
    cooldown: 300,
    run: async (client, message, args) => {
        const randomNum = await random(500, 1000);
        await addMoney(message.author.id, randomNum);
        const reasonNum = await random(0, reasonList.length - 1);
        let reason = reasonList[reasonNum].replace('{money}', ` 💵 \`${randomNum}\``);
        if (reason.includes('{user}')) {
            const randomMember = message.guild.members.cache.filter(m => m.id && !m.user.bot).random();
            reason = reason.replace('{user}', randomMember.user.username);
        }
        return message.channel.send(reason);
    },
};