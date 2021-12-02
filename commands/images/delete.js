const { Canvas } = require('canvacord');
const { MessageAttachment } = require('discord.js');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "delete",
    aliases: ["del"],
    category: "images",
    description: "xuất ra meme",
    usage: "<PREFIX>delete [@tag]",
    example: "<PREFIX>delete @phamleduy04",
    run: async (client, message, args) => {
        const nguoitag = await getMember(message, args.join(' '));
        const avaurl = nguoitag.user.displayAvatarURL({ format: 'png', dynamic: false });
        const image = await Canvas.delete(avaurl);
        const attach = new MessageAttachment(image, 'delete.png');
        return message.channel.send(attach);
    },
};