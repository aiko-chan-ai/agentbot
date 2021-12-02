const { getunplash } = require('../../functions/utils');
module.exports = {
    name: "otter",
    category: "animals",
    description: "Gởi ảnh của rái cá :D",
    usage: "<PREFIX>otter",
    run: async (client, message, args) => {
        const embed = await getunplash('otter');
        if (embed === null) return message.channel.send('Bot lỗi, vui lòng thử lại sau!');
        message.channel.send(embed);
    },
};
