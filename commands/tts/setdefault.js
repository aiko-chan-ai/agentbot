const db = require('quick.db');
const langList = {
    "en": "en-US",
    "vi": "vi-VN",
};
module.exports = {
    name: "setdefault",
    category: 'tts',
    aliases: ["setdef"],
    description: "Chọn ngôn ngữ mặc định cho lệnh <PREFIX>speak",
    usage: "<PREFIX>setdefault <en hoặc vi>",
    example: "<PREFIX>setdefault en",
    run: async (client, message, args, serverData) => {
        if(!args[0]) {
            const { defaulttts } = serverData;
            if (!defaulttts) return message.channel.send('Giọng text to speech của bạn là \`vi-VN\`');
            message.channel.send(`Ngôn ngữ của bạn là: ${langList[defaulttts]}`);
        }
        else if (!langList[args[0]]) return message.channel.send('Bạn phải nhập \`en\` hoặc \`vi\` để set ngôn ngữ mặc định.');
        else if (langList[args[0]]) {
            await db.set(`${message.guild.id}.defaulttts`, langList[args[0]]);
            message.channel.send(`Đã set ngôn ngữ mặc định của lệnh tts là: \`${langList[args[0]]}\``);
        }
    },
};