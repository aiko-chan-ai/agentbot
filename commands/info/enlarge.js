const { Util, MessageEmbed } = require('discord.js');
const { parse } = require('twemoji-parser');
module.exports = {
    name: 'enlarge',
    aliases: ['emoji', 'emo'],
    category: 'info',
    description: 'Phóng to emoji',
    usage: '<PREFIX>enlarge <emoji>',
    example: '<PREFIX>enlarge :joy:',
    note: 'Có thể một số emoji sẽ không phóng to được.',
    cooldown: 5,
    run: async (client, message, args) => {
        const emoji = args[0];
        if (!emoji) return message.channel.send("Nhập emoji gì đó đi bạn ơi.");

        const custom = Util.parseEmoji(emoji);
        const embed = new MessageEmbed()
            .setTitle(`Phiên bản phóng to của emoji: ${emoji}`)
            .setColor("BLUE");

        if (custom.id) {
            const link = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif" : "png"}`;
            embed.setImage(link)
                .setFooter(`Emoji ID: ${custom.id}`);
            return message.channel.send(embed);
        } else {
            const parsed = parse(emoji, { assetType: "png" });
            if (!parsed[0]) return message.channel.send('Emoji không hợp lệ!');
            embed.setImage(parsed[0].url);
            return message.channel.send(embed);
        }
    },
};