const tts = require('@google-cloud/text-to-speech');
const ttsClient = new tts.TextToSpeechClient();
const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);
const { sleep } = require('../../functions/utils');
const langList = require('../../assets/json/ttslang.json');
const db = require('quick.db');
const ms = require('ms');
const randomNum = require('random-number-csprng');
module.exports = {
    name: 'speak',
    aliases: ['say', 's'],
    category: 'tts',
    description: 'talk',
    usage: '<PREFIX>speak [lang] <text>',
    note: 'lang = en hoặc vi (mặc định là vi)',
    example: '<PREFIX>speak en hello world',
    run: async (client, message, args, serverData) => {
        const guildID = message.guild.id;
        const { botdangnoi, prefix } = serverData;
        let lang = serverData.defaulttts;
        if (botdangnoi === true) {
            const random = await randomNum(0, 100);
            return message.channel.send(`Có người khác đang xài lệnh rồi, vui lòng thử lại sau D:. ${random > 70 ? ` Nếu bạn nghĩ đây là lỗi, sử dụng lệnh \`${prefix}fix\` để sửa lỗi!` : ''}`);
        }
        if (!args[0]) return message.channel.send('Vui lòng nhập gì đó :D.');
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('Bạn phải vào voice channel để có thể sử dụng lệnh này.');
        const botpermission = voiceChannel.permissionsFor(client.user);
        if (!botpermission.has('CONNECT')) return message.channel.send('Bot không có quyền vào channel của bạn!');
        if (!botpermission.has('SPEAK')) return message.channel.send('Bot không có quyền nói trong channel của bạn!');
        if (!voiceChannel.joinable) return message.channel.send('Bot không vào được phòng của bạn');
        let text = args.join(' ');
        if (!lang) lang = 'vi-VN';
        if (langList[args[0]]) {
            text = args.slice(1).join(' ');
            lang = langList[args[0]];
        }
        const bot = message.guild.me;
        if (!message.guild.me.voice.selfDeaf) await message.guild.me.voice.setSelfDeaf(true);
        if (args.length > 200) return message.reply('Không được quá 200 từ!');
        // create request
        const request = {
            input: { text: text },
            voice: { languageCode: lang, ssmlGender: 'FEMALE' },
            audioConfig: { audioEncoding: 'MP3' },
        };
        const [response] = await ttsClient.synthesizeSpeech(request);
        await writeFile(`./assets/ttsdata/${guildID}.mp3`, response.audioContent, 'binary');
        // xử lý xong
        let connection = bot.voice ? bot.voice.connection : null;
        // create request
        if (!connection || bot.voice.channelID !== voiceChannel.id) {
            try {
                connection = await voiceChannel.join();
                await sleep(1000);
            }
            catch(e) {
                return message.channel.send('Bot không thể vào channel của bạn vào lúc này, vui lòng thử lại sau!');
            }
        }
        if (!connection) return message.channel.send('Bot không thể vào channel của bạn vào lúc này, vui lòng thử lại sau!');
        const dispatcher = connection.play(`./assets/ttsdata/${guildID}.mp3`);
        await db.set(`${guildID}.botdangnoi`, true);
        await db.set(`${guildID}.endTime`, Date.now() + ms('1m'));
        dispatcher.on('finish', async () => {
            await db.set(`${guildID}.botdangnoi`, false);
            if (client.ttsTimeout.has(guildID)) clearTimeout(client.ttsTimeout.get(guildID));
            const timeoutFunc = setTimeout(async () => {
                const checkTime = await db.get(`${guildID}.endTime`);
                if (!checkTime) return;
                if (Date.now() > checkTime) {
                    connection.disconnect();
                    connection = null;
                    voiceChannel.leave();
                    message.channel.send('Đã rời phòng vì không hoạt động!');
                }
                if (!message.guild.me.voice) await db.delete(`${guildID}.endTime`);
            }, ms('1m') + 1000);
            client.ttsTimeout.set(guildID, timeoutFunc);
        });
    },
};