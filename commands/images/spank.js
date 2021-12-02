const { Canvas } = require('canvacord');
const { MessageAttachment } = require('discord.js');
const db = require('quick.db');
const shipDb = new db.table('shipDb');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "spank",
    category: "images",
    description: "Vỗ mông :))",
    usage: "<PREFIX>spank [@tag]",
    example: "<PREFIX>spank @phamleduy04",
    run: async (client, message, args) => {
        const url1 = message.author.displayAvatarURL({ format: 'png', dynamic: false });
        const nguoitag = await getMember(message, args.join(' '));
        const avaurl = nguoitag.user.displayAvatarURL({ format: 'png', dynamic: false });
        const image = await Canvas.spank(url1, avaurl);
        const attach = new MessageAttachment(image, 'spank.png');
        message.channel.send(attach);
        if (shipDb.has(message.author.id)) {
            const authorData = await shipDb.get(message.author.id);
            if (authorData.target.id == nguoitag.id) {
                authorData.target.spank++;
                await shipDb.set(message.author.id, authorData);
            }
        }
    },
};