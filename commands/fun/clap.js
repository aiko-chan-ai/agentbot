module.exports = {
    name: "clap",
    category: "fun",
    description: "Clap clap 👏",
    usage: "<PREFIX>clap <nhập gì đó ở đây>",
    run: async (client, message, args) => {
        message.delete();
        if (!args[0] || !args[1]) return message.reply("Vui lòng nhập tối thiểu 2 chữ ngăn cách bởi khoảng cách. (VD: **Xin chào**)");
        const clap = args.join(' ');
        const clapped = clap.replace(/ /g, " 👏 ");
        message.channel.send(clapped);
    },
};