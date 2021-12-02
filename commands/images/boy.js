const { MessageEmbed, MessageAttachment } = require('discord.js');
const { readdirSync, readFileSync } = require('fs');
module.exports = {
    name: 'boy',
    category: 'images',
    description: 'Show ảnh gái xD (nguồn từ page @ngamtraiA)',
    aliases: ['trai', 'men'],
    usage: '<PREFIX>boy',
    cooldown: 3,
    run: async (client, message, args) => {
        const folder = readdirSync("././assets/trai");
        const randomFile = folder[Math.floor(Math.random() * folder.length)];
        const file = readFileSync(`././assets/trai/${randomFile}`);
        const ext = randomFile.slice(-3);
        const attachment = new MessageAttachment(file, `traidep.${ext}`);
        const embed = new MessageEmbed()
            .attachFiles(attachment)
            .setImage(`attachment://traidep.${ext}`)
            .setFooter('Nguồn: @ngamtraiA');
        message.channel.send(embed);
    },
};