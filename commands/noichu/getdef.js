const axios = require('axios');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'getdef',
    aliases: ['dinhnghia', 'getdefinition', 'definition'],
    category: 'noichu',
    description: 'Lấy định nghĩa của từ trong game nối chữ',
    usage: '<PREFIX>getdef',
    run: async (client, message, args, guildData) => {
        const { noituArray } = guildData;
        if (noituArray.length == 0) return message.reply('Lệnh này chỉ sử dụng khi chơi nối từ!');
        const lastWord = noituArray[noituArray.length - 1];
        let res;
        try {
            res = await axios.get(`https://owlbot.info/api/v4/dictionary/${lastWord}`, { headers: { Authorization: `TOKEN ${process.env.OWLBOT}` } });
        }
        catch(err) {
            message.channel.send(`Mình không tìm thấy nghĩa của từ: ${lastWord}`);
        }
        const { type, definition, example, image_url } = res.data.definitions[0];
        const embed = new MessageEmbed()
            .setTitle(lastWord)
            .setURL(`https://owlbot.info/?q=${lastWord}`)
            .addField('Loại từ: ', type)
            .addField('Định nghĩa: ', definition)
            .setFooter(`Từ này có ${res.data.definitions.length} nghĩa.`);
        if (example) embed.addField('Ví dụ: ', example);
        if (image_url) embed.setImage(image_url);
        message.channel.send(embed);
    },
};