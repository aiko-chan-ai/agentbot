const { MessageEmbed, MessageAttachment } = require("discord.js");
const db = require('quick.db');
const shipDb = new db.table('shipDb');
const moment = require('moment');
const { getMember } = require('../../functions/utils');
module.exports = {
    name: "ship",
    category: "fun",
    description: "Shippppppp",
    usage: "<PREFIX>ship [@tag]",
    note: "<PREFIX>ship rename để rename tên \n<PREFIX>ship sink để phá thuyền",
    cooldown: 20,
    run: async (client, message, args) => {
        const embed = new MessageEmbed();
        const authorData = await shipDb.get(message.author.id);
        const member = await getMember(message, args.join(' '), false);
        switch (args[0]) {
            case 'rename':
                if (!authorData) return message.channel.send('Bạn không có thuyền!');
                const newName = args.slice(1).join(' ');
                await shipDb.set(`${message.author.id}.shipName`, newName);
                await shipDb.set(`${authorData.target.id}.shipName`, newName);
                message.channel.send('✅ | Thao tác thành công!');
                break;
            case 'sink':
            case 'sank':
            case 'chìm':
                if (!authorData) return message.channel.send('Bạn không có thuyền!');
                await shipDb.delete(message.author.id);
                await shipDb.delete(authorData.target.id);
                message.channel.send('Bạn đã cho chìm tàu 💔');
                break;
            default: {
                if (member && authorData && (member.id !== authorData.target.id)) return message.channel.send('Bạn đã có thuyền rồi!');
                if (!authorData) {
                    if (!member) return message.channel.send('Bạn hiện tại không ship với ai!');
                    else {
                            if (member.id == message.author.id) return message.channel.send('Bạn không thể ship với chính mình.');
                            if (shipDb.has(member.id)) return message.channel.send('Người bạn tag đã có thuyền!');
                            // bắt đầu ship xD
                            const filter = m => m.author.id == member.id;
                            const msg = await message.channel.send(`${member}, bạn có muốn lên thuyền cùng **${message.member.nickname}** không?\nNhập **accept** để đồng ý!`);
                            const collector = msg.channel.createMessageCollector(filter, { time: 15000 });

                            collector.on('collect', async m => {
                                if (m.content.toLowerCase() == 'accept') {
                                    const shipName = `${message.author.username.slice(0, 3)} và ${member.user.username.slice(0, 3)}`;
                                    await setDefault(message.author, member, shipName);
                                    await setDefault(member, message.author, shipName);
                                    message.channel.send(`🚢 Thuyền **${shipName}** đã được đẩy.\nĐể đổi tên thuyền hãy nhập lệnh \`ship rename\`!\nĐể chìm thuyền hãy sử dụng lệnh \`ship sink\`!`);
                                    collector.stop();
                                } else if (m.content.toLowerCase() == 'decline') {
                                    collector.stop('tuchoi');
                                }
                            });

                            collector.on('end', async (_, reason) => {
                                if (reason == 'tuchoi') return message.channel.send('Bạn đã từ chối lời mời lên thuyền!');
                                else if (reason == 'time') {
                                    if (msg.deletable) msg.delete();
                                    return message.channel.send('Lời mời hết hạn!');
                                }
                            });
                        }
                } else {
                    // deconstruct
                    const { hugs, slaps, spank, kiss, cookie, pat, poke, since, punch } = authorData.target;
                    const targetData = await shipDb.get(authorData.target.id);
                    const { readFileSync } = require('fs');
                    const ship = readFileSync('././assets/images/ship.png');
                    const attachment = new MessageAttachment(ship, 'ship.png');
                    let arrTuongTac = [
                        hugs + targetData.target.hugs !== 0 ? `🤗 Ôm: ${hugs + targetData.target.hugs}` : '',
                        slaps + targetData.target.slaps !== 0 ? `🤚 Tát: ${slaps + targetData.target.slaps}` : '',
                        spank + targetData.target.spank !== 0 ? `🍑 Tét: ${spank + targetData.target.spank}` : '',
                        kiss + targetData.target.kiss !== 0 ? `💋 Hôn: ${kiss + targetData.target.kiss}` : '',
                        cookie + targetData.target.cookie !== 0 ? `🍪 Bánh quy: ${cookie + targetData.target.cookie}` : '',
                        punch + targetData.target.punch !== 0 ? `👊 Đấm: ${punch + targetData.target.punch}` : '',
                        pat + targetData.target.pat !== 0 ? `👋 Vỗ đầu: ${pat + targetData.target.pat}` : '',
                        poke + targetData.target.poke !== 0 ? `👉 Chọc: ${poke + targetData.target.poke}` : '',
                    ];
                    arrTuongTac = arrTuongTac.filter(x => x);
                    embed.setAuthor(authorData.shipName, message.guild.iconURL())
                        .attachFiles(attachment)
                        .setThumbnail('attachment://ship.png')
                        .addField(`Cặp đôi: `, `${message.author} và <@${authorData.target.id}>`)
                        .addField('Tương tác: ', arrTuongTac.length !== 0 ? arrTuongTac : 'Chưa có gì cả')
                        .addField('Thuyền tạo vào: ', moment(since).fromNow());
                    message.channel.send(embed);
                }
            }
        }
    },
};
async function setDefault(first, second, shipName) {
    if (!first || !second || !shipName) return;
    await shipDb.set(first.id, {
        shipName: shipName,
        target: {
            id: second.id,
            hugs: 0,
            slaps: 0,
            spank: 0,
            kiss: 0,
            cookie: 0,
            pat: 0,
            punch: 0,
            poke : 0,
            since: Date.now(),
        },
    });
}