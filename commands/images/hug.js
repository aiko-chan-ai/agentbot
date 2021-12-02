const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const db = require('quick.db');
const shipDb = new db.table('shipDb');
module.exports = {
    name: "hug",
    category: "images",
    description: "Ôm ai đó hoặc tất cả",
    usage: "<PREFIX>hug [@tag]",
    example: "<PREFIX>hug (ôm tất cả) hoặc <PREFIX>hug @phamleduy04",
    run: async (client, message, args) => {
        let nguoitag = message.mentions.members.array();
        if (nguoitag.length == 0 && args[0]) nguoitag = await message.guild.members.fetch({ user: args[0] }).catch(() => null);
        try {
            const response = await axios.get('https://some-random-api.ml/animu/hug');
            const embed = new MessageEmbed()
                .setImage(response.data.link);
            if (!nguoitag || nguoitag.length == 0) embed.setDescription(`${message.member} đã ôm tất cả mọi người <3`);
            else {
                embed.setDescription(`Awwww, ${message.member} đã ôm ${nguoitag} <3`);
                if (shipDb.has(message.author.id)) {
                    const authorData = await shipDb.get(message.author.id);
                    const nguoiTagID = nguoitag.map(member => member.id);
                    if (nguoiTagID.includes(authorData.target.id)) {
                        authorData.target.hugs++;
                        await shipDb.set(message.author.id, authorData);
                        embed.setFooter(`Cái ôm ${authorData.target.hugs !== 1 ? `thứ ${authorData.target.hugs}` : 'đầu tiên'} của bạn.`);
                    }
                }
            }
            return message.channel.send(embed);
        }
        catch(e) {
            console.log(e);
            return message.channel.send("Bot lỗi khi cố gắng lấy hình, hãy thử lại sau");
        }
    },
};