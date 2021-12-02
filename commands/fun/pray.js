const { getMember } = require('../../functions/utils');
module.exports = {
    name: "pray",
    category: "fun",
    description: "Cầu nguyện cho bạn bè :DD",
    usage: "pray [@tag, id]",
    example: "pray @phamleduy04",
    run: async (client, message, args) => {
        if (!args[0]) return message.reply("Cầu nguyện thì phải cần tag nha bạn");
        const person = await getMember(message, args.join(' '));
        if (message.author.id === person.id) return message.reply("Có thờ có thiêng có duyên chết liền. Cầu cho người khác chứ cầu cho mình hoài vậy.");
        message.channel.send(`🙏 ${message.member.displayName} đã cầu nguyện cho ${person.displayName} \n Chúc bạn may mắn :D`);
    },
};