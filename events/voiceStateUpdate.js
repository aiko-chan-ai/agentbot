const db = require('quick.db');
module.exports = (client, oldstate, newstate) => {
    if (oldstate.member.id !== client.user.id) return;
    if (newstate.channelID == null) {
        const guildID = oldstate.guild.id;
        db.set(`${guildID}.botdangnoi`, false);
        db.delete(`${guildID}.endtime`);
        if (client.ttsTimeout.has(guildID)) clearTimeout(client.ttsTimeout.get(guildID));
    }
};