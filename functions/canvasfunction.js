const Canvas = require('canvas');
const { join } = require('path');
module.exports = {
    welcome: async function welcome(username, discrim, avatarURL, membersize) {
        if (!username) throw new Error("No username was provided");
        if (!discrim) throw new Error("No discrim was provided!");
        if (!avatarURL) throw new Error("No avatarURL was provided!");
        if (!membersize) throw new Error("No membersize was provided!");

        Canvas.registerFont(join(__dirname, '..', 'assets', 'font', 'Cadena.ttf'), { family: 'Cadena', weight: "regular", style: "normal" });
        // create canvas
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(join(__dirname, '..', 'assets', 'images', 'moscow.png'));
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const font = 'Cadena';

        ctx.font = `30px ${font}`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'start';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'black';
        ctx.fillText('Chào mừng', 260, 100);

        const welcometextPosition = { width: 260, height: 150 };
        let fontSize = 55;
        ctx.font = `${fontSize}px ${font}`;

        do {
            fontSize -= 1;
            ctx.font = `${fontSize}px ${font}`;
        } while (ctx.measureText(`${username}#${discrim}!`).width > 430);

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'start';
        ctx.fillText(`${username}`, welcometextPosition.width, welcometextPosition.height, 455);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'start';
        ctx.fillText(`#${discrim}!`, ctx.measureText(`${username}`).width + welcometextPosition.width, welcometextPosition.height);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'start';
        ctx.font = `29px ${font}`;
        ctx.fillText(`Bạn là người thứ ${membersize} của server!`, welcometextPosition.width, welcometextPosition.height + 40);
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(avatarURL);
        ctx.drawImage(avatar, 25, 25, 200, 200);
        return canvas.toBuffer();
    },
};