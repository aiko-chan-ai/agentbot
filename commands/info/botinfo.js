const { version, license } = require('../../package.json');
const { utc } = require('moment');
const os = require('os');
const { MessageEmbed, version: djsversion } = require('discord.js');
const { formatBytes, laysodep } = require('../../functions/utils');
const ms = require('ms');
module.exports = {
    cooldown: 10,
    name: 'botinfo',
    category: 'info',
    description: 'Show info của bot!',
    usage: '<PREFIX>botinfo',
    run: async (client, message, args) => {
        const guildManager = client.guilds.cache;
        const core = os.cpus()[0];
        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(message.guild.me.displayHexColor || 'RANDOM')
            .addField("General", [
                `**--> Tên bot:** ${client.user.tag} (${client.user.id})`,
                `**--> Số shard:** ${client.shard.count}`,
                `**--> Số lệnh:** ${client.commands.filter(el => el.category && !el.ownerOnly).size} lệnh`,
                `**--> Uptime:** ${ms(client.uptime)}`,
                `**--> Server:** ${laysodep(guildManager.size)}`,
                `**--> Users:** ${laysodep(guildManager.reduce((a, b) => a + b.memberCount, 0))}`,
                `**--> Channels:** ${laysodep(client.channels.cache.size)}`,
                `**--> Ngày tạo bot:** ${utc(client.user.createdTimestamp).format('MM/DD/YYYY HH:mm:ss')}`,
                `**--> Node.js version:** ${process.version}`,
                `**--> Bot version: ** v${version}`,
                `**--> Discord.js version:** v${djsversion}`,
                `**--> License:** ${license}`,
                '\u200b',
            ])
            .addField('System', [
                `**--> Platfrom: ** ${process.platform}`,
                `**--> CPU:**`,
                `\u3000 Cores: ${os.cpus().length}`,
                `\u3000 Model: ${core.model}`,
                `\u3000 Speed: ${core.speed}MHz`,
                `**--> Memory:**`,
                `\u3000 Total: ${formatBytes(process.memoryUsage().heapTotal)}`,
                `\u3000 Used: ${formatBytes(process.memoryUsage().heapUsed)}`,
                `**--> Hostname:** ${os.hostname()}`,
            ])
            .setTimestamp();
        message.channel.send(embed);
    },
};