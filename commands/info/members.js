const SS = require('string-similarity');
const { MessageEmbed } = require('discord.js');
const { trimArray } = require('../../functions/utils');
module.exports = {
    name: "members",
    aliases: ['member'],
    category: "info",
    description: "Xem tên thành viên trong 1 role.",
    usage: "<PREFIX>members <tên role>",
    run: async (client, message, args) => {
        if (!args[0]) return message.reply(`Ghi tên role giúp mình với D:`).then(m => m.delete({ timeout: 5000 }));
        let role = await message.guild.roles.fetch(args[0]);
        if (!role) {
            role = message.guild.roles.cache.filter(r => r.managed === false).array().map(g => g.name);
            const search = args.join(' ');
            const matches = SS.findBestMatch(search, role);
            role = message.guild.roles.cache.find(el => el.name == matches.bestMatch.target);
        }
        const members = role.members.map(m => m.user);
        if (members.length === 0) return message.channel.send('Không có ai đang có role này!');
        const embed = new MessageEmbed()
            .setTitle(`Thành viên trong \`${role.name}\``)
            .setDescription(members.length < 30 ? members.join('\n') : trimArray(members, 30))
            .setFooter(`Số người có role này: ${role.members.size}`);
        message.channel.send(embed);
    },
};