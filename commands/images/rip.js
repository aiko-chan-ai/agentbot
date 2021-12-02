const { Canvas } = require('canvacord');
const { MessageAttachment } = require('discord.js');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "rip",
    category: "images",
    description: "Cho vào ảnh bia mộ",
    usage: "<PREFIX>rip [@tag]",
    example: "<PREFIX>rip @phamleduy04",
    run: async (client, message, args) => {
        const nguoitag = await getMember(message, args.join(' '));
        const avaurl = nguoitag.user.displayAvatarURL({ format: 'png', dynamic: false });
        const image = await Canvas.rip(avaurl);
        const attach = new MessageAttachment(image, 'rip.png');
        return message.channel.send(attach);
    },
};