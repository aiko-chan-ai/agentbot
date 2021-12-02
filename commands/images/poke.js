const { readFileSync, readdirSync } = require('fs');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const db = require('quick.db');
const shipDb = new db.table('shipDb');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: 'poke',
    aliases: ['chot', 'chọt'],
    category: 'images',
    description: 'chọt ai đó',
    usage: '<PREFIX>poke <@tag>',
    run: async (client, message, args) => {
        const folder = readdirSync('././assets/poke');
        const file = readFileSync(`././assets/poke/${folder[Math.floor(Math.random() * folder.length)]}`);
        const attachment = new MessageAttachment(file, 'poke.gif');
        const nguoitag = await getMember(message, args.join(' '));
        if (!nguoitag) return message.reply('Vui lòng tag một ai đó');
        else if (nguoitag.id == message.author.id) return message.channel.send('Bạn không thể tự tag chính mình.');
        const embed = new MessageEmbed()
            .attachFiles(attachment)
            .setImage('attachment://poke.gif')
            .setDescription(` ${message.member} đã chọt ${nguoitag} 👉`);
        if (shipDb.has(message.author.id)) {
            const authorData = await shipDb.get(message.author.id);
            if (authorData.target.id == nguoitag.id) {
                authorData.target.poke++;
                await shipDb.set(message.author.id, authorData);
                embed.setFooter(`Lần chọt ${authorData.target.poke !== 1 ? `thứ ${authorData.target.poke}` : 'đầu tiên'} của bạn`);
            }
        }
        message.channel.send(embed);
    },
};