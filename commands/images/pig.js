const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const { join } = require('path');
const { getMember } = require('../../functions/utils');

module.exports = {
    name: 'pig',
    aliases: ['heo', 'h3o', 'he0'],
    ownerOnly: true,
    description: 'Bạn là con meo mập địch hihi',
    run: async (client, message, args) => {
        const canvas = Canvas.createCanvas(1000, 500);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(join(__dirname, '..', '..', 'assets', 'images', 'heo.jpg'));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const member = await getMember(message, args.join(' '), false);
        if (!member) return message.channel.send('Vui lòng tag hoặc nhập ID');
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg', size: 128 }));
        ctx.drawImage(avatar, 420, 50, 150, 150);
        const buffer = canvas.toBuffer();
        const attachment = new MessageAttachment(buffer);
        message.channel.send(attachment);
    },
};