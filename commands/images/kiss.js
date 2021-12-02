const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const db = require('quick.db');
const shipDb = new db.table('shipDb');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "kiss",
    category: "images",
    description: "Chụt chụt :D",
    usage: "<PREFIX>kiss <@tag>",
    run: async (client, message, args) => {
        try {
            const nguoitag = await getMember(message, args.join(' '));
            const response = await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY}&tag=kiss&rating=R`);
            if (!nguoitag) return message.reply('Tag 1 người nào đi bạn.');
            if (nguoitag.id == message.author.id) return message.channel.send('Bạn không thể tự thơm chính mình.');
            const embed = new MessageEmbed()
                .setDescription(`${message.member} đã thơm ${nguoitag} 💋`)
                .setImage(response.data.data.images.original.url);
            if (shipDb.has(message.author.id)) {
                const authorData = await shipDb.get(message.author.id);
                if (authorData.target.id == nguoitag.id) {
                    authorData.target.kiss++;
                    await shipDb.set(message.author.id, authorData);
                    embed.setFooter(`Nụ hôn ${authorData.target.kiss !== 1 ? `thứ ${authorData.target.kiss}` : 'đầu tiên'} của bạn.`);
                }
            }
            message.channel.send(embed);
        }
        catch(e) {
            console.log(e);
            return message.channel.send("Bot lỗi khi cố gắng lấy hình, hãy thử lại sau");
        }
    },
};