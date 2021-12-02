const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'snipe',
    aliases: ['snipes'],
    description: 'Xem tin nhắn xoá gần đây nhất!',
    cooldown: 30,
    run: async (client, message, args) => {
        const msg = client.snipes.get(message.channel.id);
        if (!msg) return message.reply('Không tìm thấy!');
        message.react('<:target:801105643221942292>');
        const embed = new MessageEmbed()
            .setAuthor(`Người gởi: ${msg.author.tag}`, msg.author.displayAvatarURL())
            .setColor('RED')
            .setDescription(msg.content)
            .setFooter(`Message ID: ${msg.ID} | Author ID: ${msg.author.id}`);

        if (msg.image) embed.setImage(msg.image);

        message.channel.send(embed);
    },
};