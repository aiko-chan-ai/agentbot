const wolfarm_key = process.env.WOLFRAM;
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "wolf",
    category: "info",
    description: "Hỏi bot (toán, anh, văn, lịch sử, v.v) (sử dụng tiếng anh)",
    example: "<PREFIX>wolf GDP of vietnam",
    usage: "<PREFIX>wolf <câu hỏi>",
    run: async (client, message, args) => {
        try {
            const query = encodeURIComponent(args.join(' '));
            const res = await axios.get(`https://api.wolframalpha.com/v2/query?input=${query}&format=image&output=JSON&appid=${wolfarm_key}`);
            const data = res.data;
            if (data.queryresult.success === false) return message.reply("Mình không hiểu bạn đang hỏi gì, vui lòng hỏi câu khác.");
            const embed = new MessageEmbed()
                .setTitle(`Question: ${args.join(' ')}`)
                .setTimestamp()
                .setImage(data.queryresult.pods[1].subpods[0].img.src);
            message.channel.send(embed);
        }
        catch(e) {
            message.channel.send(`Bot lỗi: ${e.message}`);
        }
    },
};