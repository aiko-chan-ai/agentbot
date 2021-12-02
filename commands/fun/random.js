const random = require('random-number-csprng');
module.exports = {
    name: "random",
    category: "fun",
    description: "Random 1 số từ 0 tới x",
    usage: '<PREFIX>random <số tối đa>',
    example: '<PREFIX>random 100 (sẽ random từ 0 tới 100)',
    run: async (client, message, args) => {
        if (!args[0] || isNaN(args[0])) return message.reply('Số thứ nhất không hợp lệ, vui lòng thử lại');
        const first = parseInt(args[0]);
        const second = parseInt(args[1]) || null;
        if (first < 0 || second < 0) return message.channel.send('Số không thể nhỏ hơn 0');
        if (first > 1000000000 || second > 1000000000) return message.channel.send('Số không thể lớn hơn 1 000 000 000');
        if (args[1] && second === null) return message.reply('Số thứ hai không hợp lệ, vui lòng thử lại!');
        try {
            const randomNum = await random(second ? first : 0, second ? second : first);
            return message.channel.send(`🎲 Số của bạn là: ${Math.abs(randomNum)}`);
        }
        catch (err) {
            if (err.message.includes('The maximum value must be higher than the minimum value')) return message.channel.send('Số đầu tiên phải nhỏ hơn số thứ hai!');
            return message.channel.send('Số không hợp lệ!');
        }
    },
};