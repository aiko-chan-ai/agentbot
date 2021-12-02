const { Canvas } = require('canvacord');
const { MessageAttachment } = require('discord.js');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "bed",
    category: 'images',
    description: 'xuất ra meme',
    usage: '<PREFIX>bed [@tag]',
    run: async (client, message, args) => {
        const url1 = message.author.displayAvatarURL({ format: 'png', dynamic: false });
        const nguoitag = await getMember(message, args.join(' '));
        const avaurl = nguoitag.user.displayAvatarURL({ format: 'png', dynamic: false });
        const image = await Canvas.bed(url1, avaurl);
        const attach = new MessageAttachment(image, 'bed.png');
        return message.channel.send(attach);
    },
};