const urban = require('relevant-urban');
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "urban",
    category: "info",
    description: "Từ điển từ lóng của Tiếng Anh",
    usage: "<PREFIX>urban <từ cần tìm>",
    example: "<PREFIX>urban yeet",
    run: async (client, message, args, tools) => {
        if (!args[0]) return message.reply(`Bạn phải nhập gì đó để mình tìm chứ`);
        // Fetch from urban dict
        const res = await urban(args.join(' ')).catch(() => null);
        if (!res) return message.channel.send(`Không tìm thấy từ **${args.join(' ')}**`);
        const { word, urbanURL, definition, example, thumbsUp, thumbsDown, author } = res;
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(word)
            .setURL(urbanURL)
            .setDescription(`**Definition:**\n*${definition}*\n\n**Example:**\n${example}*`)
            .addField('Author: ', author, true)
            .addField('Rating: ', `**\`Upvotes: ${thumbsUp} | Downvotes: ${thumbsDown}\`**`);
        message.channel.send(embed);
    },
};