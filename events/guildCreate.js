const { MessageEmbed } = require('discord.js');
module.exports = async (client, newguild) => {
    const owner = await newguild.members.fetch(newguild.ownerID);
    await newguild.members.fetch();
    const embed = new MessageEmbed()
        .setTitle("New Server Joined")
        .addField('Guild Name: ', newguild.name, true)
        .addField('Guild ID: ', newguild.id, true)
        .addField("Guild members: ", newguild.memberCount, true)
        .addField("Owner server: ", owner.user.tag, true)
        .setFooter(`OwnerID: ${newguild.ownerID}`);
    await client.shard.broadcastEval(`this.channels.cache.get("809139238524026900").send(${embed})`);
    // agent's server
};