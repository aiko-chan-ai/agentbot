const { MessageEmbed } = require("discord.js");
const weather = require('weather-js');
module.exports = {
    name: "weather",
    category: "info",
    description: "Thông tin thời tiết",
    usage: "<PREFIX>weather <mã bưu điện hoặc tên thành phố>",
    example: "<PREFIX>weather Ho Chi Minh",
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send("Vui lòng ghi tên thành phố");
        const query = args.join(' ');
        weather.find({ search: query, degreeType: 'C' }, (err, result) => {
            if (err || !result || result.length == 0) return message.reply(`Bot không tìm được địa điểm, vui lòng thử từ khoá khác.`);
            const { skytext, observationpoint, temperature, feelslike, winddisplay, humidity, imageUrl } = result[0].current;
            const embed = new MessageEmbed()
                .setDescription(`**${skytext}** `)
                .setThumbnail(imageUrl)
                .setAuthor(`Thời tiết ở ${observationpoint} hôm nay`)
                .addField(`Nhiệt độ: `, `${temperature} °C`, true)
                .addField(`Feels like®: `, `${feelslike} °C`, true)
                .addField(`Gió: `, winddisplay, true)
                .addField(`Độ ẩm: `, `${humidity}%`, true);
            return message.channel.send(embed);
        });
    },
};