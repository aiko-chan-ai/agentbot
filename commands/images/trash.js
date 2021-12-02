const { Canvas } = require('canvacord');
const { MessageAttachment } = require('discord.js');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "trash",
    category: "images",
    description: "Bỏ vào thùng rác",
    usage: "<PREFIX>trash [@tag]",
    example: "<PREFIX>trash @phamleduy04",
    run: async (client, message, args) => {
        const nguoitag = await getMember(message, args.join(' '));
        const avaurl = nguoitag.user.displayAvatarURL({ format: 'png', dynamic: false });
        const image = await Canvas.trash(avaurl);
        const attach = new MessageAttachment(image, 'trash.png');
        return message.channel.send(attach);
    },
};