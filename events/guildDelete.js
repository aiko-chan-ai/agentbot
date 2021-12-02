const { MessageEmbed } = require('discord.js');
module.exports = async (client, oldGuild) => {
    const embed = new MessageEmbed()
        .setTitle("Bot left the server!")
        .addField('Guild Name: ', oldGuild.name, true)
        .addField('Guild ID: ', oldGuild.id, true)
        .addField('Guild members: ', oldGuild.memberCount, true)
        .setFooter(`OwnerID: ${oldGuild.ownerID}`);
    await client.shard.broadcastEval(`this.channels.cache.get("809139238524026900").send(${embed})`);
// agent's server
};