const { getunplash } = require('../../functions/utils');
module.exports = {
    name: "hamster",
    category: "animals",
    description: "Gởi ảnh về hamster",
    usage: "<PREFIX>hamster",
    run: async (client, message, args) => {
        const embed = await getunplash('hamster');
        if (embed === null) return message.channel.send('Bot lỗi, vui lòng thử lại sau!');
        message.channel.send(embed);
    },
};