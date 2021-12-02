const serverFlags = require('../../assets/json/serverflag.json');
const { MessageEmbed } = require('discord.js');
const { trimArray } = require('../../functions/utils');
const moment = require('moment');
module.exports = {
    name: 'serverinfo',
    aliases: ['guild', 'server', 'guildinfo'],
    description: 'Đưa thông tin của server!',
    category: 'info',
    usage: '<PREFIX>serverinfo',
    run: async (client, message, args) => {
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = await message.guild.members.fetch();
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;
        const embed = new MessageEmbed()
            .setTitle(`**Thông tin server __${message.guild.name}__**`)
            .setColor('BLUE')
            .setFooter(`Server ID: ${message.guild.id}`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField('Chung', [`**--> Tên server:** ${message.guild.name}`,
        `**--> Owner:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
        `**--> Level của server:** ${message.guild.premiumTier ? `Level ${message.guild.premiumTier}` : 'None'}`,
        `**--> Bộ lọc:** ${serverFlags.filterLevels[message.guild.explicitContentFilter]}`,
        `**--> Mức độ xác minh:** ${serverFlags.verificationLevels[message.guild.verificationLevel]}`])
            .addField('Thống kê', [`**--> Số role:** ${roles.length}`,
        `**--> Số emoji:** ${emojis.size} (${emojis.filter(e => !e.animated).size} emoji thường và ${emojis.filter(e => e.animated).size} emoji động)`,
        `**--> Thành viên:** ${message.guild.memberCount} (${members.filter(m => !m.user.bot).size} người và ${members.filter(m => m.user.bot).size} bot)`,
        `**--> Channel:** ${channels.filter(c => c.type === 'text').size + channels.filter(c => c.type === 'voice').size} (${channels.filter(c => c.type === 'text').size} text channel và ${channels.filter(c => c.type === 'voice').size} voice channel)`,
        `**--> Số boost:** ${message.guild.premiumSubscriptionCount || '0'}`,
        `**--> Ngày tạo server:** ${moment(message.guild.createdTimestamp).format('MM/DD/YYYY hh:mm:ss')}`])
            .addField(`Roles: `, roles.length < 10 ? roles.join(', ') : roles.length > 10 ? trimArray(roles, 10) : 'None')
            .setTimestamp();
        message.channel.send(embed);
    },
};