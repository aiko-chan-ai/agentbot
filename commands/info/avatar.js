const { MessageEmbed } = require('discord.js');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "avatar",
    aliases: ["ava", "avt"],
    category: "info",
    description: "Xem avatar của người khác",
    usage: "<PREFIX>avatar <tag>",
    example: "<PREFIX>avatar @phamleduy04",
    run: async (client, message, args) => {
        const embed = new MessageEmbed();
        const member = await getMember(message, args.join(' '));
        const avaurl = member.user.displayAvatarURL({ format: 'jpg', dynamic: true, size: 1024 });
        embed.setImage(avaurl)
            .setTitle(`Link avatar: `)
            .setURL(avaurl);
        message.channel.send(embed);
    },
};