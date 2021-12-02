const { MessageEmbed } = require("discord.js");
const { getMember, formatDate, trimArray } = require('../../functions/utils');
const flags = require('../../assets/json/userflag.json');
module.exports = {
    name: "whois",
    aliases: ["who", "user", "info", "userinfo"],
    category: "info",
    description: "Thông tin về người dùng",
    usage: "<PREFIX>whois <@tag,username,ID>",
    run: async (client, message, args) => {
        const member = await getMember(message, args.join(' '));
            // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(r => r.id !== message.guild.id)
            .map(r => r);
        // User variables
        const created = formatDate(member.user.createdAt);
        let userFlags = "";
        if (member.user.flags) userFlags = member.user.flags.toArray();
        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)
            .addField('Thông tin thành viên (server)', [
                `**- Nickname:** ${member.displayName}`,
                `**- Tag:** ${member}`,
                `**- Vào server vào ngày:** ${joined}`,
                `**- Roles:** ${roles.length == 0 ? 'Không có' : roles.length < 10 ? roles.join(', ') : roles.length >= 10 ? trimArray(roles, 10) : ''}`,
            ], true)
            .addField('Thông tin người dùng', [
                `**- ID:** ${member.user.id}`,
                `**- Tên người dùng**: ${member.user.username}`,
                `**- Tag**: ${member.user.tag}`,
                `**- Tạo vào lúc**: ${created}`,
                `**- Huy hiệu**: ${userFlags.length ? userFlags.map(flag => flags[flag]).join(", ") : "Không có" }`,
            ], true)
            .setTimestamp();
        if (member.user.presence.activities.length > 0)
            embed.addField('Đang chơi: ', `**- Tên game:** ${member.user.presence.activities[0].name}`);

        message.channel.send(embed);
    },
};