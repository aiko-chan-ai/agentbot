const { Canvas } = require('canvacord');
const { MessageAttachment } = require('discord.js');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "gay",
    category: "images",
    description: "Cho 7 màu vào avt =))",
    usage: "<PREFIX>gay [@tag]",
    example: "<PREFIX>gay @phamleduy04",
    run: async (client, message, args) => {
        const nguoitag = await getMember(message, args.join(' '));
        const avaurl = nguoitag.user.displayAvatarURL({ format: 'png', dynamic: false, size: 1024 });
        const image = await Canvas.rainbow(avaurl);
        const attach = new MessageAttachment(image, 'gay.png');
        return message.channel.send(attach);
    },
};