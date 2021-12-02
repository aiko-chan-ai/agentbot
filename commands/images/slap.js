const { MessageEmbed, MessageAttachment } = require("discord.js");
const { readFileSync, readdirSync } = require('fs');
const db = require('quick.db');
const shipDb = new db.table('shipDb');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "slap",
    category: "images",
    description: "Tát ai đó",
    usage: "<PREFIX>slap <@tag>",
    run: async (client, message, args) => {
        const folder = readdirSync("././assets/slap/");
        const file = readFileSync(`././assets/slap/${folder[Math.floor(Math.random() * folder.length)]}`);
        const attachment = new MessageAttachment(file, 'slap.gif');
        const nguoitag = await getMember(message, args.join(' '));
        const embed = new MessageEmbed()
            .attachFiles(attachment)
            .setImage('attachment://slap.gif');
        if (!nguoitag) embed.setDescription(`${message.member} đã tự vả chính mình 🤚`);
        else if (shipDb.has(message.author.id)) {
            const authorData = await shipDb.get(message.author.id);
            if (authorData.target.id == nguoitag.id) {
                authorData.target.slaps++;
                await shipDb.set(message.author.id, authorData);
                embed.setFooter(`Cái tát ${authorData.target.slaps !== 1 ? `thứ ${authorData.target.slaps}` : 'đầu tiên'} của bạn.`);
            }
        }
        embed.setDescription(`${message.member} đã tát vỡ mồm ${nguoitag} 🤚`);
        message.channel.send(embed);
    },
};