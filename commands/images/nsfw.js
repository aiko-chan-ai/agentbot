const { KSoftClient } = require('ksoft.js');
const { MessageEmbed } = require('discord.js');
const ksoft_key = process.env.KSOFTKEY;
const ksoft = new KSoftClient(ksoft_key);
module.exports = {
    name: "nsfw",
    category: "images",
    description: "send nsfw images",
    usage: "<PREFIX>nsfw",
    note: 'Lệnh chỉ sử dụng được ở channel có mode NSFW',
    run: async (client, message, args) => {
        if (!message.channel.nsfw) return message.channel.send("Lệnh này chỉ sử dụng được ở channel có bật mode NSFW!");
        const respond = await ksoft.images.nsfw();
        const embed = new MessageEmbed()
            .setTitle(`From ${respond.post.subreddit}`)
            .setDescription(`NSFW image:`)
            .setURL(respond.url)
            .setFooter(`Powered by KSoft.Si`)
            .setImage(respond.url);
        return message.channel.send(embed);
    },
};