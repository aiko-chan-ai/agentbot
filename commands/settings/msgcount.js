const db = require('quick.db');
const { ownerID } = require('../../config.json');
module.exports = {
    name: "msgcount",
    category: "settings",
    description: "Tuỳ chỉnh bật tắt hệ thống rank của bot.",
    usage: "<PREFIX>msgcount <on, off>",
    note: "cần quyền MANAGE_MESSAGES",
    run: async (client, message, args) => {
        if(message.author.id !== ownerID && !message.member.hasPermission("MANAGE_MESSAGES")) return message.reply('Bạn cần có quyền MANAGE_MESSAGES để sử dụng lệnh này.');
        if (!args[0]) return message.reply('Bạn phải nhập on hoặc off để sử dụng lệnh này.');
        if (args[0] == "on") {
            await db.set(`${message.guild.id}.msgcount`, true);
            return message.channel.send('✅ Đã bật hệ thống rank!');
        } else if (args[0] == "off") {
            await db.set(`${message.guild.id}.msgcount`, false);
            return message.channel.send('✅ Đã tắt hệ thống rank.');
        }
        else return message.channel.send('Bạn phải nhập on hoặc off để sử dụng lệnh này.');
    },
};