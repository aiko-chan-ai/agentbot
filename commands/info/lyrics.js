const { KSoftClient } = require('ksoft.js');
const { MessageEmbed } = require('discord.js');
const ksoft = new KSoftClient(process.env.KSOFTKEY);

module.exports = {
    name: "lyrics",
    aliases: ["lyric"],
    category: "info",
    description: "Tìm lời bài hát",
    usage: "<PREFIX>lyrics <tên bài hát>",
    example: "<PREFIX>lyrics bad guy",
    run: async (client, message, args) => {
        if (!args[0]) return message.reply("Nhập tên bài hát cần tìm lyrics");
        const song = args.join(' ');
        const respond = await ksoft.lyrics.get(song, false).catch(() => null);
        if (!respond) return message.channel.send('Bot lỗi, vui lòng thử lại sau!');
        const { name, lyrics, artist } = respond;
        const lyricsLength = lyrics.length;
        if (lyricsLength > 4095) return message.reply("Lyrics của bài hát bạn đang tìm quá dài để bot có thể xử lý.");
        const firstembed = new MessageEmbed()
            .setAuthor(`Song: ${name} by ${artist.name}`)
            .setDescription(lyricsLength > 2048 ? lyrics.slice(0, 2048) : lyrics)
            .setFooter('Powered by KSoft.Si');
        message.channel.send(firstembed);
        if (lyricsLength > 2048) {
            const secondembed = new MessageEmbed()
            .setDescription(lyrics.slice(2048, lyrics.length))
            .setFooter('Powered by KSoft.Si');
        message.channel.send(secondembed);
        }
    },
};