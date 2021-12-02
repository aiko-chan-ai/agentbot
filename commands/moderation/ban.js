const { MessageEmbed } = require("discord.js");
const { promptMessage } = require('../../functions/utils');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "ban",
    category: "moderation",
    description: "Ban 1 người trong server",
    usage: "<PREFIX>ban <@tag, id> [lý do]",
    example: "<PREFIX>ban @phamelduy04",
    run: async (client, message, args, serverData) => {
        const { logchannel: logChannelID } = serverData;
        const logChannel = message.guild.channels.cache.get(logChannelID) || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) return message.reply("Vui lòng tag một người nào đó để ban.").then(m => m.delete({ timeout: 5000 }));
        const reason = args.slice(1).join(' ') || "Không có.";

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ Bạn không có quyền để ban người khác.")
                .then(m => m.delete({ timeout: 5000 }));

        }
        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ Bot không có quyền ban người khác, vui lòng kiểm tra lại.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        const toBan = await getMember(message, args.join(' '), false);

        // No member found
        if (!toBan) {
            return message.reply("Không tìm thấy người cần ban, vui lòng thử lại.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("Bạn không thể tự ban chính mình.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("Mình không thể ban người này vì người này role cao hơn mình.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
            .addField('Lệnh ban', [
                `**- Đã ban:** ${toBan} (${toBan.id})`,
                `**- Người ban:** ${message.member} (${message.member.id})`,
                `**- Lý do:** ${reason}`,
            ]);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Hãy trả lời trong 30s`)
            .setDescription(`Bạn có muốn ban ${toBan}?`);

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                try {
                    if (msg.deletable) msg.delete();
                    await toBan.send(`Bạn vừa bị ban ở server \`${toBan.guild.name}\`. Lý do: \`${reason}\``);
                    toBan.ban({ reason: reason });
                    logChannel.send(embed);
                }
                catch(err) {
                    if (err.message.includes("Cannot send messages to this user")) {
                        toBan.ban({ reason: reason });
                        logChannel.send(embed);
                    }
                    else return message.channel.send(`Bị lỗi khi ban: ${err.message}`);
                };
            } else if (emoji === "❌") {
                msg.delete();
                message.reply(`Đã huỷ ban`)
                    .then(m => m.delete({ timeout: 10000 }));
            }
        });
    },
};