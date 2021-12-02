const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../functions/utils");
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kick 1 người trong server",
    usage: "<PREIFX>kick <@tag, id> [lý do]",
    example: "<PREFIX>kick @phamleduy04",
    run: async (client, message, args, serverData) => {
        const { logchannel: logChannelID } = serverData;
        const logChannel = message.guild.channels.cache.get(logChannelID) || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) return message.reply("Vui lòng tag một người nào đó để kick.").then(m => m.delete({ timeout: 5000 }));
        const reason = args.slice(1).join(' ') || "Không có lý do.";

        // No author permissions
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ Bạn không có quyền để kick người khác.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ Bot không có quyền kick người khác, vui lòng kiểm tra lại.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        const toKick = await getMember(message, args.join(' '), false);
        // No member found
        if (!toKick) {
            return message.reply("Không tìm thấy người cần kick, vui lòng thử lại.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // Can't kick urself
        if (toKick.id === message.author.id) {
            return message.reply("Bạn không thể tự kick chính mình.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // Check if the user's kickable
        if (!toKick.kickable) {
            return message.reply("Mình không thể kick người này vì người này role cao hơn mình.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp()
            .addField('Lệnh kick', [
                `**- Đã kick:** ${toKick} (${toKick.id})`,
                `**- Người kick:** ${message.member} (${message.member.id})`,
                `**- Lý do:** ${reason}`,
            ]);

        const promptEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`Hãy trả lời trong 30s.`)
            .setDescription(`Bạn có muốn kick ${toKick}?`);

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // The verification stuffs
            if (emoji === "✅") {
                try {
                    if (message.deletable) msg.delete();
                    await toKick.send(`Bạn vừa bị kick ra khỏi server \`${toKick.guild.name}\`. Lý do: \`${args.slice(1).join(' ')}\``);
                    toKick.kick(reason);
                    logChannel.send(embed);
                }
                catch(err) {
                    if (err.message.includes("Cannot send messages to this user")) {
                        toKick.kick(reason);
                        logChannel.send(embed);
                    }
                    else return message.channel.send(`Bị lỗi khi ban: ${err.message}`);
                };
            } else if (emoji === "❌") {
                msg.delete();
                message.reply(`Đã huỷ kick.`)
                    .then(m => m.delete({ timeout: 10000 }));
            }
        });
    },
};
