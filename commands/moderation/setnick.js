const { ownerID } = require('../../config.json');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "setnick",
    aliases: ["setnickname"],
    category: "moderation",
    description: "set nickname",
    usage: "<PREFIX>setnick <tag> [nickname]",
    note: "nickname bỏ trống = reset nickname",
    example: "<PREFIX>setnick @phamleduy04 Duy",
    run: async (client, message, args) => {
        if (!message.member.hasPermission('MANAGE_NICKNAMES') && message.author.id !== ownerID) return message.reply("Bạn cần có quyền `\ MANAGE_NICKNAMES `\ để có thể đổi nickname.");
        const user = await getMember(message, args.join(' '));
        let output = args.slice(1).join(' ');
        if (!args[0]) return message.reply(`Phải tag ai đó chứ`);
        if (!output) output = user.user.username;
        const nickname = args.slice(1).join(' ');
        const status = await user.setNickname(nickname)
            .catch(e => {
                return e;
            });
        if (status.code == 50013) return message.channel.send(`Mình không có quyền đổi nickname cho người này!`);
        if (status.message && status.name) return message.channel.send(`Lỗi: ${status.name}, ${status.message}`);
        message.channel.send(`Set nickname thành công cho ${user} thành **${output}**`);
    },
};