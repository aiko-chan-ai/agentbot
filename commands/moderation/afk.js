const db = require('quick.db');
const afkData = new db.table('afkdata');
module.exports = {
    name: 'afk',
    description: 'Ai đó sẽ nhận thông báo khi bạn afk',
    usage: '<PREFIX>afk [lời nhắn]',
    example: '<PREFIX>afk sẽ quay trở lại sau',
    run: async (client, message, args) => {
        let userDb = afkData.get(message.author.id);
        if (!userDb) userDb = await afkData.set(message.author.id, { afk: false, loinhan: '' });
        if (userDb.afk == true) {
            await afkData.set(`${message.author.id}.afk`, false);
            message.channel.send('Bạn đã tắt chế độ afk');
        } else {
            let loinhan = args.join(' ');
            if (!loinhan) loinhan = 'Sẽ quay trở lại sau!';
            await afkData.set(message.author.id, { afk: true, loinhan: loinhan });
            message.channel.send('Bạn đã bật chế độ afk!');
        }
    },
};