const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
    name: "reminder",
    category: "info",
    description: "Đặt lời nhắc",
    usage: "<PREFIX>reminder <time> (5s,15m,1h,2d) <text>",
    example: "<PREFIX>reminder 1h Đi học",
    run: async (client, message, args) => {
        const reminderTime = args[0];
        if (!reminderTime) return message.reply("Vui lòng nhập thời gian.");
        const reminder = args.slice(1).join(" ") || `Lời nhắc của ${message.author.username}`;
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${message.author.username}'s Reminder`)
            .addField("Reminder: ", `${reminder}`)
            .addField("Time", `${reminderTime}`)
            .setTimestamp();
        message.channel.send(embed);

        setTimeout(async function() {
                embed.setColor("RANDOM")
                    .setTitle(`${message.author.username}'s Reminder`)
                    .addField("Reminder: ", `${reminder}`)
                    .setTimestamp();
            await message.channel.send(message.author, { embed: embed });
        }, ms(reminderTime));
    },
};