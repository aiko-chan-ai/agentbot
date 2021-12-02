const { MessageEmbed } = require("discord.js");
const { getMember } = require('../../functions/utils');

module.exports = {
    name: "love",
    category: "fun",
    description: "Người khác yêu bạn cỡ nào?",
    usage: "<PREFIX>love [@tag, id]",
    example: `<PREFIX>love @phamleduy04`,
    run: async (client, message, args) => {
        // Get a member from mention, id, or username
        const person = await getMember(message, args.join(' '));

        if (!person || !args[0]) return message.channel.send('Hãy tag ai đó đi!');
        const love = Math.random() * 100;
        const loveIndex = Math.floor(love / 10);
        const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);

        const embed = new MessageEmbed()
            .setColor("#ffb6c1")
            .addField(`☁ **${person.displayName}** loves **${message.member.displayName}** this much:`,
                `💟 ${Math.floor(love)}%\n\n${loveLevel}`);

        message.channel.send(embed);
    },
};