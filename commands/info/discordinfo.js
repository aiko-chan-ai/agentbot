const { MessageEmbed } = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'discordinfo',
    aliases: ['discordstatus', 'status'],
    description: 'Thông tin về server của discord',
    usage: '<PREFIX> status',
    run: async (client, message, args) => {
        try {
            const res = await axios.get('https://srhpyqt94yxb.statuspage.io/api/v2/components.json');
            const embed = new MessageEmbed()
                .setTitle('Thông tin server của Discord')
                .setTimestamp();
            res.data.components.forEach(component => {
                embed.addField(component.name, component.status);
            });
            message.channel.send(embed);
        }
        catch(e) {
            console.log(e);
            return message.channel.send('Bot gặp lỗi trong khi cố gắng kết nối tới Discord! Vui lòng thử lại sau.');
        }
    },
};