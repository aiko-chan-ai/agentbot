const SQLite = require('better-sqlite3');
const sql = new SQLite('./data.sqlite');
const { ownerID } = require('../../config.json');
module.exports = {
    name: 'resetrank',
    category: 'settings',
    description: 'Reset rank cho server!',
    usage: '<PREFIX>resetrank',
    run: async (client, message, args) => {
        if(message.author.id !== ownerID && !message.member.hasPermission("MANAGE_GUILD")) return message.reply('Bạn cần có quyền MANAGE_GUILD để sử dụng lệnh này.');
        await sql.prepare('DELETE FROM xpdata WHERE guild = ?').run(message.guild.id);
        message.channel.send('Đã reset rank của server!');
    },
};