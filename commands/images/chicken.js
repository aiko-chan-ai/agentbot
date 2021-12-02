const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const { join } = require('path');
const { getMember } = require('../../functions/utils');
const { ownerID } = require('../../config.json');

module.exports = {
    name: 'chicken',
    aliases: ['gà', 'ga', 'chick'],
    description: 'gà lứm',
    run: async (client, message, args) => {
        const authorizedUser = [ownerID, '540403537532813321'];
        if (!authorizedUser.includes(message.author.id)) return message.channel.send('Bạn không có quyền sử dụng lệnh này!');
        const canvas = Canvas.createCanvas(1000, 500);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage(join(__dirname, '..', '..', 'assets', 'images', 'ga.jpg'));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const member = await getMember(message, args.join(' '), false);
        if (!member) return message.channel.send('Vui lòng tag hoặc nhập ID');
        if (member.id == ownerID) return message.channel.send('Dui không bao giờ ga`!');
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg', size: 128 }));
        ctx.drawImage(avatar, 310, 50, 100, 100);
        const buffer = canvas.toBuffer();
        const attachment = new MessageAttachment(buffer);
        message.channel.send('Gà lắm', attachment);
    },
};