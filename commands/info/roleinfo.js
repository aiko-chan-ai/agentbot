const { MessageEmbed } = require("discord.js");
const stringSimilarity = require('string-similarity');

module.exports = {
    name: "roleinfo",
    category: "info",
    description: "Trà về thông tên về role",
    usage: '<PREFIX>roleinfo <tên role>',
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send('Vui lòng nhập ID của role hoặc tên của role!');
        let role = await message.guild.roles.fetch(args[0]);
        if (!role) {
            const roles = message.guild.roles.cache.filter(r => r.managed === false).map(g => g.name);
            const search = args.join(' ');
            const matches = stringSimilarity.findBestMatch(search, roles);
            const find = matches.bestMatch.target;
            role = message.guild.roles.cache.find(el => el.name === find);
        }
        const membersWithRole = role.members;
        const embed = new MessageEmbed()
            .setColor(role.color)
            .setTitle("Roleinfo")
            .addField("ID: ", role.id)
            .addField("Tên role: ", role.name, true)
            .addField("Số lượng:", membersWithRole.size, true)
            .addField("Vị trí: ", role.position, true)
            .addField("Tag được? ", role.mentionable ? "Có" : "Không", true)
            .addField("Hiển thị? ", role.hoist ? "Có" : "Không", true)
            .addField("Màu: ", role.hexColor, true);
        message.channel.send(embed);
    },
};