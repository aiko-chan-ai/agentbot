const { ownerID } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'developer',
    aliases: ['dev'],
    description: 'Show info của owner của bot xD',
    category: 'info',
    usage: '<PREFIX> developer',
    run: async (client, message, args) => {
        const Dui = await client.users.fetch(ownerID);
        const embed = new MessageEmbed()
            .setTitle(`Thông tin về Developer`)
            .addField('Thông tin cá nhân', [
                `Tên Discord: ${Dui.tag}`,
                "Quốc gia: :flag_vn:",
                `ID user: ${Dui.id}`,
            ])
            .setThumbnail(Dui.displayAvatarURL());
        message.channel.send(embed);
    },
};