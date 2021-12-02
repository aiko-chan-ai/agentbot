const Canvas = require('canvas');
const { join } = require('path');
const { getMember } = require('../../functions/utils');
const { MessageAttachment } = require('discord.js');
const quotes = ['non lắm', 'búp trên cành', 'mới nhú', 'nảy mầm'];
module.exports = {
    name: 'non',
    description: 'non lắm',
    ownerOnly: true,
    run: async (client, message, args) => {
        const canvas = Canvas.createCanvas(1000, 500);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage(join(__dirname, '..', '..', 'assets', 'images', 'non.jpg'));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const member = await getMember(message, args.join(' '), false);
        if (!member) return message.channel.send('Vui lòng tag hoặc nhập ID');
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png', size: 128 }));
        ctx.drawImage(avatar, 700, 125, 100, 100);
        const buffer = canvas.toBuffer();
        const attachment = new MessageAttachment(buffer);
        message.channel.send(quotes[Math.floor(Math.random() * quotes.length)], attachment);
    },
};