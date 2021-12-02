const math = require('mathjs');
const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "calc",
    aliases: ['calculate', 'maytinh'],
    category: "fun",
    description: "Tính toán nhanh",
    note: "Căn bậc 2 sử dụng sqrt(), đổi đơn vị (cm to inch), v.v",
    usage: "<PREFIX>calc <câu hỏi>",
    run: async (client, message, args) => {
        if (!args[0]) return message.reply("Nhập phép tính để tính chứ bạn ơi :(");
        try {
            const resp = math.evaluate(args.join(' '));
            const embed = new MessageEmbed()
                .setColor(0xffffff)
                .setTitle('Bot tính toán')
                .addField('Input', `\`\`\`${args.join(' ')}\`\`\``)
                .addField('Output', `\`\`\`js\n${resp}\`\`\``);
            message.channel.send(embed);
        } catch (e) {
            return message.channel.send("Mình không giải được :(");
        }
    },
};