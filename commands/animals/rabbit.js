const { getunplash } = require('../../functions/utils');
module.exports = {
    name: "rabbit",
    category: "animals",
    description: "Gởi ảnh của thỏ :D",
    usage: "<PREFIX>rabbit",
    run: async (client, message, args) => {
        const embed = await getunplash('rabbit');
        if (embed === null) return message.channel.send('Bot lỗi, vui lòng thử lại sau!');
        message.channel.send(embed);
    },
};
