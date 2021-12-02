const { Canvas } = require('canvacord');
const { MessageAttachment } = require('discord.js');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "trigger",
    category: "images",
    description: "Triggererrreerere",
    usage: "<PREFIX>trigger [@tag]",
    example: "<PREFIX>trigger @phamleduy04",
    run: async (client, message, args) => {
        const nguoitag = await getMember(message, args.join(' '));
        const avaurl = nguoitag.user.displayAvatarURL({ format: 'png', dynamic: false });
        const image = await Canvas.trigger(avaurl);
        const attach = new MessageAttachment(image, 'trigger.gif');
        return message.channel.send(attach);
    },
};