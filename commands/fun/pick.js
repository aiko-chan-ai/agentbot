module.exports = {
    name: "pick",
    category: "fun",
    description: "Bot sẽ giúp bạn chọn!",
    usage: "<PREFIX>pick <lựa chọn 1, lựa chọn 2, ...>",
    example: "<PREFIX>pick chơi game, học bài",
    run: async (client, message, args) => {
        if (!args[0] || !args[1]) return message.channel.send('Sai cú pháp, vui lòng nhập lệnh `help pick` để biết thêm chi tiết.');
        const pickWordlist = args.join(' ').split(',');
        message.channel.send(pickWordlist[Math.floor(Math.random() * pickWordlist.length)]);
    },
};