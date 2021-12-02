module.exports = {
    name: "daily",
    category: 'gamble',
    aliases: ['hangngay', 'vote'],
    description: "Nhận tiền hàng ngày",
    usage: '<PREFIX>daily',
    note: 'Upvote bot để nhận tiền!',
    run: async (client, message, args) => {
        message.channel.send('Bạn hãy vote cho bot nha!\nSau khi bạn vote bot sẽ tự động cộng tiền cho bạn.\nhttps://top.gg/bot/645883401500622848/vote');
    },
};