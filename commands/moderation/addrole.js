const stringSimilarity = require('string-similarity');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "addrole",
    aliases: ["roleadd", "ar"],
    category: "moderation",
    description: "Thêm role cho người nào đó",
    usage: "<PREFIX>addrole <tag> <rolename>",
    example: "<PREFIX>addrole @phamleduy04 DJ",
    run: async (client, message, args) => {
        if (!args[0]) {
            return message.reply("Bạn phải tag ai đó").then(m => m.delete({ timeout: 5000 }));
        } else if (!message.member.hasPermission('MANAGE_ROLES') && message.author.id !== '455935236262592512') {
            return message.reply("Bạn không có quyền `MANAGE_ROLES`!");
        } else {
            const user = await getMember(message, args[0]);
            const roles = message.guild.roles.cache.filter(r => r.managed === false).map(g => g.name);
            const search = args.slice(1).join(' ');
            const matches = stringSimilarity.findBestMatch(search, roles);
            const role = message.guild.roles.cache.find(el => el.name === matches.bestMatch.target);
            if (!user)
                return message.reply("Không tìm thấy người bạn tag, vui lòng thử lại.");
            const status = await message.guild.member(user).roles.add(role)
                .catch(e => {
                    return e;
                });
            if (status.message && status.name) return message.channel.send(`Lỗi: ${status.name}, ${status.message}`);
            message.channel.send(`✅ Đã add role **${role.name}** cho **${user.user.tag}**!`);
        }
    },
};