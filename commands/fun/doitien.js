const { KSoftClient } = require('ksoft.js');
const { MessageEmbed } = require('discord.js');
const ksoft_key = process.env.KSOFTKEY;
const ksoft = new KSoftClient(ksoft_key);

module.exports = {
    name: "doitien",
    category: "fun",
    description: "Đổi tiền tệ",
    usage: "<PREFIX>doitien <số lượng> <từ đơn vị này> <sang đơn vị này>",
    note: "from, to phải sử dụng chuẩn ISO 3 kí tự như là USD, EUR",
    example: '<PREFIX>doitien 150 USD VND',
    run: async (client, message, args) => {
        try {
            if (!args[0]) return message.reply("Vui lòng nhập số tiền cần chuyển!");
            if (!args[1] || !args[2]) return message.reply("Vui lòng ghi tiền tệ cần chuyển!");
            const before = args[1].toUpperCase();
            const respond = await ksoft.kumo.convert(args[0], before, args[2]);
            const embed = new MessageEmbed()
                .setTitle("Tỉ giá tự động cập nhật sau mỗi giờ!")
                .addField("Giá trị trước khi đổi: ", `${args[0]} ${before}`)
                .addField("Giá trị sau khi đổi: ", respond.pretty)
                .setFooter("Kết quả chỉ mang tính chất tham khảo.");
            message.channel.send(embed);
        } catch(e) {
            if (e.message.includes('currency')) {
                return message.channel.send(`Không tồn lại đơn vị tiền tệ: \`${e.message.split(' ')[1]}\``);
            }
            message.channel.send(`Bot lỗi: \`${e.message}\``);
        }
    },
};