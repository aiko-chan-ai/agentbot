const isURL = require('is-url');
const { Util } = require('discord.js');
module.exports = {
    name: 'stealemo',
    category: 'moderation',
    aliases: ['cuopemo', 'cuopemoji'],
    description: 'Lấy emoji của server khác và upload vào server của chính mình',
    usage: '<PREFIX>cuopemo <emoji, hoặc URL của emoji> <tên emoji>',
    example: '<PREFIX>cuopemo :fun: vui',
    cooldown: 10,
    run: async (client, message, args) => {
        if (!message.member.hasPermission('MANAGE_EMOJIS')) return message.channel.send('Bạn không có quyền `MANAGE_EMOJIS` để sử dụng lệnh này!');
        if (!message.guild.me.hasPermission('MANAGE_EMOJIS')) return message.channel.send('Bot không có quyền `MANAGE_EMOJIS` để sử dụng lệnh này!');
        if (!args[0] || !args[1]) return message.channel.send('Vui lòng nhập đủ dữ liệu để bot có thể chạy!');
        let emoji;
        if (isURL(args[0])) emoji = args[0];
        else emoji = Util.parseEmoji(args[0]);

        try {
            if (emoji.id) emoji = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? "gif" : "png"}`;
            await message.guild.emojis.create(emoji, args.slice(1).join(' '));
            message.channel.send('✅ | Thao tác thành công!');
        }

        catch(e) {
            if (e.message.includes('Invalid image data') || e.message == 'The resource must be a string, Buffer or a valid file stream.') return message.channel.send('Hình bạn cung cấp không hợp lệ!');
            else return message.channel.send(`Bot lỗi: ${e.message}`);
        }
    },
};