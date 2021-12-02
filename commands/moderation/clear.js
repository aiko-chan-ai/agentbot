const { log } = require('../../functions/log');
module.exports = {
    name: "clear",
    aliases: ["purge"],
    category: "moderation",
    description: "Xoá tin nhắn",
    usage: "<PREFIX>clear [@tag] <số tin nhắn>",
    example: "<PREFIX>clear @phamleduy04 10",
    run: async (client, message, args) => {
        if (message.deletable) await message.delete();
        // Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Bạn không có quyền MANAGE_MESSAGES").then(m => m.delete({ timeout: 5000 }));
        }

        // Maybe the bot can't delete messages
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Bot không có quyền MANAGE_MESSAGES nên bot không thể xoá.").then(m => m.delete({ timeout: 5000 }));
        }

        const user = message.mentions.users.first();
        const amount = !isNaN(args[0]) ? parseInt(args[0]) : parseInt(args[1]);
        if (!amount) return message.reply('Vui lòng nhập số lượng tin nhắn để xoá.');
        if (amount < 1) return message.reply('Vui lòng nhập số lớn hơn 1.');
        if (amount > 100) return message.reply('Vui lòng nhập số nhỏ hơn 100.');
        if (!user) {
            message.channel.bulkDelete(amount, true).then(delmsg => {
                message.channel.send(`Đã xoá \`${delmsg.size}\` tin nhắn!`).then(m => m.delete({ timeout: 5000 }));
            })
            .catch(error => {
                if (error.code !== 10008) {
                    log(`${error.message}`);
                }
            });
        } else {
            message.channel.messages.fetch({
                limit: 100,
            }).then(messages => {
                messages = messages.filter(m => m.author.id === user.id).array().slice(0, amount);
                message.channel.bulkDelete(messages, true).then(delmsg => {
                    message.channel.send(`Đã xoá \`${delmsg.size == 0 ? 1 : delmsg.size}\` tin nhắn!`).then(m => m.delete({ timeout: 5000 }));
                })
                .catch(error => {
                    if (error.code !== 10008) {
                        log(`${error.message}`);
                    }
                });
            });
        }

    },

};