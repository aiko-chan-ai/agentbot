const db = require('quick.db');
const { welcome } = require('../functions/canvasfunction');
const { MessageAttachment } = require('discord.js');
module.exports = async (client, member) => {
    const serverdata = db.get(member.guild.id);
    if (!db.has(`${member.guild.id}.welcomechannel`)) return;
    const channel = member.guild.channels.cache.get(serverdata.welcomechannel);
    if (!channel) return;
    const image = await welcome(member.user.username, member.user.discriminator, member.user.displayAvatarURL({ format: 'png', dynamic: false }), member.guild.memberCount);
    const attachment = new MessageAttachment(image, 'welcome.png');
    return channel.send(attachment);
};