const { Canvas } = require('canvacord');
const { MessageAttachment } = require('discord.js');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: 'jail',
    category: 'images',
    description: 'Cho vào tù',
    usage: '<PREFIX>jail [@tag]',
    run: async (client, message, args) => {
        const nguoitag = await getMember(message, args.join(' '));
        const avaurl = nguoitag.user.displayAvatarURL({ format: 'png', dynamic: false });
        const image = await Canvas.jail(avaurl);
        const attachment = new MessageAttachment(image, 'jail.png');
        return message.channel.send(attachment);
    },
};