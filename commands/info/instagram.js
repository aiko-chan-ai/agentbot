const { MessageEmbed } = require("discord.js");
const axios = require('axios');
const { laysodep } = require('../../functions/utils');
module.exports = {
    name: "instagram",
    aliases: ["insta"],
    category: "info",
    description: "Trả về thông tin cơ bản của tài khoản Instagram",
    usage: "<PREFIX> instagram <tên instagram>",
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send('Bạn vui lòng nhập instagram của bạn!');
        const instagram = args.join(' ');
        const url = `https://instagram.com/${instagram}/?__a=1`;
        const res = await axios.get(url, { headers: { cookie: process.env.INSTAGRAM_COOKIE } }).catch(() => null);
        if (!res) return message.channel.send('Mình không tìm thấy Instagram của bạn!');
        const account = res.data.graphql.user;
        const { profile_pic_url_hd: profilePic, full_name, username, biography, edge_owner_to_timeline_media: sobaidang, edge_followed_by: follower, edge_follow: following, is_private } = account;
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(full_name)
            .setURL(`https://instagram.com/${instagram}`)
            .setThumbnail(profilePic)
            .addField("Thông tin cá nhân", [
                `**- Tên người dùng:** ${username}`,
                `**- Tên đầy đủ:** ${full_name}`,
                `**- Bio:** ${biography.length == 0 ? "Không có" : biography}`,
                `**- Số bài đăng:** ${laysodep(sobaidang.count)}`,
                `**- Followers:** ${laysodep(follower.count)}`,
                `**- Following:** ${laysodep(following.count)}`,
                `**- Private?:** ${is_private ? "Có 🔐" : "Không 🔓"}`,
            ]);
        message.channel.send(embed);
    },
};