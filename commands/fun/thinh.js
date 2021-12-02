const array = require('../../assets/json/thinh.json').data;
module.exports = {
    name: "thinh",
    aliases: ["xinthinh"],
    category: "fun",
    description: "Xin thính",
    usage: "<PREFIX>thinh",
    cooldown: 2,
    run: async (client, message, args) => {
        const random = array[Math.floor(Math.random() * array.length)];
        message.channel.send(random);
    },
};