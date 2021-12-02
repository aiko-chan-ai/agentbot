const SQLite = require('better-sqlite3');
const sql = new SQLite('./data.sqlite');
const { pages } = require('../../functions/utils');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "leaderboard",
    aliases: ["bxh"],
    category: "ranking",
    description: "Xem bảng xếp hạng nhắn tin trong server",
    usage: "leaderboard [số trang]",
    note: "Max level là 999",
    example: "leaderboard 2",
    run: async (client, message, args, serverData) => {
        await message.guild.members.fetch();
        const { prefix, msgcount: serverStatus } = serverData;
        if (serverStatus === false) return message.channel.send('Server không bật hệ thống rank!');
        let server_data = sql.prepare("SELECT * FROM xpdata WHERE guild = ? ORDER BY level DESC, xp DESC;").all(message.guild.id);
        if (server_data.length === 0) return message.channel.send('Bảng xếp hạng đang trống!');
        server_data = await Promise.all(server_data.map(async (data, index) => {
            const user = message.guild.members.cache.get(data.user);
            if (user) {
                let next_level_xp = data.level * 100;
                if (next_level_xp.toString().length >= 4) {
                    next_level_xp = next_level_xp / 1000;
                    const int_part = Math.trunc(next_level_xp);
                    const float_part = Number((next_level_xp - int_part).toFixed(1));
                    next_level_xp = `${int_part + float_part}K`;
                }
                let user_xp = data.xp;
                if (user_xp.toString().length >= 4) {
                    user_xp = user_xp / 1000;
                    const int_part = Math.trunc(user_xp);
                    const float_part = Number((user_xp - int_part).toFixed(1));
                    user_xp = `${int_part + float_part}K`;
                }
                return {
                    tag: user.user.username,
                    level: data.level,
                    rank: index + 1,
                    xp: user_xp,
                    next_xp: next_level_xp,
                };
            }
        }));
        server_data = server_data.filter(data => data);
        if (args[0] && isNaN(args[0])) return message.reply('Vui lòng nhập số trang');
        const page = pages(server_data, 10, args[0] || 1);
        if (!page) return message.reply('Trang bạn nhập không tồn tại!');
        const embed = new MessageEmbed()
            .setAuthor(`Bảng xếp hạng | ${message.guild.name}`, message.guild.iconURL())
            .setColor('RANDOM')
            .setDescription(page.map(e => `\`#${e.rank}\` | **${e.tag}** (Level ${e.level}, XP: ${e.xp}/${e.next_xp})`))
            .setFooter(`Sử dụng lệnh ${prefix}bxh <số> để xem các hạng tiếp theo.`);
        message.channel.send(embed);
    },
};