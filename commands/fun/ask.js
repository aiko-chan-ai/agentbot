const { askdb } = require('../../ask.json');
module.exports = {
    name: "ask",
    category: "fun",
    description: "Trả về câu trả lời đúng, sai hoặc không biết.",
    note: "Hơi gắt xíu D:",
    usage: "<PREFIX>ask <câu hỏi>",
    run: async (client, message, args) => {
        if (!args[0]) return message.reply("Hỏi gì đi chứ bạn :D.");
        const random = askdb[Math.floor(Math.random() * askdb.length)];
        return message.reply(random);
    },
};