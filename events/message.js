const db = require('quick.db');
const { verifyWord, updateNoiTu } = require('../functions/utils');
const timerEmoji = '<a:timer:714891786274734120>';
const ms = require('ms');
const msgCooldown = new Set();
const { MessageEmbed, Collection } = require('discord.js');
const axios = require('axios');
const cmdCooldown = new Collection();
const afkData = new db.table('afkdata');
const commandDb = new db.table('disable');
const moneyDb = new db.table('moneydb');
const { addMoney } = require('../functions/economy');
const { timezone, ownerID } = require('../config.json');
const { log } = require('../functions/log');
const { TYPE_RUN, SNOWFLAKEAPI, SIMSIMI } = process.env;
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    const guildID = message.guild.id;
    const authorID = message.author.id;
    // prefix
    if (guildID == '699872807605108744' && !moneyDb.has(authorID) && TYPE_RUN == 'production') {
        await addMoney(authorID, 50000);
        await moneyDb.set(authorID, true);
        message.author.send('✅|Bạn vừa nhận được 50000 Agent!\nCảm ơn bạn đã ủng hộ bot!').catch(() => null);
    }
    let serverData = await db.get(guildID);
    if (!serverData) serverData = await db.set(message.guild.id, { prefix: TYPE_RUN == 'production' ? "_" : "*", logchannel: null, msgcount: true, defaulttts: null, botdangnoi: false, aiChannel: null, msgChannelOff: [], blacklist: false, aiLang: 'vi', noitu: null, noituStart: false, noituArray: [], maxWords: 1500, noituLastUser: null, rankChannel: 'default' });
    const { msgChannelOff, aiChannel, aiLang, noitu, noituStart, noituArray, maxWords, noituLastUser, rankChannel } = serverData;
    if (!maxWords) await updateNoiTu(message.guild.id);
    if (!msgChannelOff) await db.set(`${message.guild.id}.msgChannelOff`, []);
    const listChannelMsg = await db.get(`${message.guild.id}.msgChannelOff`);
    if (message.guild && db.get(`${message.guild.id}.msgcount`) && !msgCooldown.has(message.author.id) && !listChannelMsg.includes(message.channel.id)) {
        let userdata = client.getScore.get(message.author.id, message.guild.id);
        if (!userdata) userdata = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, xp: 0, level: 1 };
        if (userdata.level !== 999) {
        const xpAdd = Math.floor(Math.random() * 12);
        const nextlvl = userdata.level * 100;
        if (userdata.xp > nextlvl) {
            userdata.level++;
            userdata.xp = 0;
            const rankUpMsg = `${message.author}, Bạn đã lên cấp **${userdata.level}**!`;
            if (rankChannel == 'default' && checkMsgPerm(client, message)) message.channel.send(rankUpMsg);
            else if (rankChannel && !isNaN(rankChannel)) {
                const channel = message.guild.channels.cache.get(rankChannel);
                channel.send(rankUpMsg);
            }
        } else userdata.xp += xpAdd;
        client.setScore.run(userdata);
        }
        msgCooldown.add(message.author.id);
            setTimeout(() => {
                msgCooldown.delete(message.author.id);
        }, ms('1m'));
    }
    // noitu
    if (isInChannel(message, serverData, noitu, 'noichu')) {
        const query = message.content.toLowerCase();
        if (noituLastUser == message.author.id) return errnoitu(message, 'Bạn đã nối từ trước đó rồi, vui lòng chờ!');
        if (!verifyWord(query) || query.length == 1) return errnoitu(message, `Từ \`${message.content}\` không tồn tại trong từ điển của bot!`);
        if (!noituStart) await db.set(`${guildID}.noituStart`, true);
        else if (noituArray.length !== 0) {
            const lastWord = noituArray[noituArray.length - 1];
            const shouldStart = lastWord.slice(-1);
            if (!query.startsWith(shouldStart)) return errnoitu(message, `Từ của bạn phải bắt đầu bằng chữ \`${shouldStart}\`!`);
        }
        if (noituArray.includes(query)) return errnoitu(message, `Từ \`${query}\` đã có người nối từ trước!`);
        await message.react('✅');
        await db.push(`${guildID}.noituArray`, query);
        await db.set(`${guildID}.noituLastUser`, message.author.id);
        if (noituArray.length + 1 > maxWords) {
            const embed = new MessageEmbed()
                .setAuthor('Agent Bot', client.user.avatarURL())
                .setDescription(`Trò chơi kết thúc vì số từ chơi đã vượt giới hạn (${maxWords} từ)\n\nVui lòng nhập từ mới!`)
                .setFooter(`Sử dụng lệnh ${serverData.prefix}setmaxword để tăng giới hạn.`);
            message.channel.send(embed);
            await updateNoiTu(guildID, maxWords, noitu);
        }
        return;
    }
    // ai channel
    if (isInChannel(message, serverData, aiChannel)) {
        let res;
        if (!aiLang || aiLang === 'vi') res = await axios.get(`https://api.simsimi.net/v1/c3c/?text=${encodeURIComponent(message.content)}&lang=vi_VN&key=${SIMSIMI}`);
        else res = await axios.get(`https://api.snowflakedev.xyz/api/chatbot?name=Agent%20Bot&gender=male&user=${message.author.id}&message=${encodeURIComponent(message.content)}`, { headers: { Authorization: SNOWFLAKEAPI } });
        if (!checkMsgPerm(client, message)) return message.author.send('Mình không có quyền gởi tin nhắn ở server này!').catch(err => console.log(err.message));
        if (aiLang === 'vi' && res.data.messages.response.includes('no-reply@simsimi.com')) return message.channel.send('Bot lỗi, vui lòng thử lại sau!');
        return message.channel.send(!aiLang || aiLang === 'vi' ? res.data.messages.response : res.data.message);
    }
    // check unafk
    let checkAFK = await afkData.get(message.author.id);
    if (!checkAFK) checkAFK = await reset_afk(message.author.id);
    if (checkAFK.afk === true) {
        await reset_afk(message.author.id);
        message.reply('Bạn không còn AFK nữa!');
    }
    const mention = message.mentions.members.array();
    if (mention.length !== 0) {
    mention.forEach(async member => {
        let userAFK = await afkData.get(member.id);
        if (!userAFK) userAFK = await reset_afk(member.id);
        if (userAFK.afk === true) message.channel.send(`${member.user.username} đã AFK, lời nhắn: ${userAFK.loinhan}`);
    });
    }
    const prefixlist = [`<@${client.user.id}>`, `<@!${client.user.id}>`, serverData.prefix];
    let prefix = null;
    for (const thisprefix of prefixlist) {
        if (message.content.toLowerCase().startsWith(thisprefix)) prefix = thisprefix;
    }
    if (prefix === null || !message.content.startsWith(prefix)) return;
    const blacklist_status = await db.get(`${message.guild.id}.blacklist`);
    if (!blacklist_status) await db.set(`${message.guild.id}.blacklist`, false);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
        if (!checkMsgPerm(client, message)) return message.author.send('Mình không có quyền gởi tin nhắn ở server này!').catch(err => console.log(`${message.author.id} không mở DMs`));
        if (command.ownerOnly === true && message.author.id !== ownerID) return message.channel.send('Lệnh này chỉ dành cho Owner của bot!');
        let guildCheck = await commandDb.get(message.guild.id);
        if (!guildCheck) guildCheck = await commandDb.set(message.guild.id, []);
        if (guildCheck.includes(command.name)) return message.channel.send('Lệnh này đã bị tắt ở server này!');
        if (!cmdCooldown.has(command.name)) cmdCooldown.set(command.name, new Collection());
        const now = Date.now();
        const timestamps = cmdCooldown.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id) && message.author.id !== ownerID) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`${timerEmoji} Vui lòng đợi thêm \`${timeLeft.toFixed(1)} giây\` để có thể sử dụng lệnh này.`);
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        if (blacklist_status === true && command.name !== 'blacklist') return message.channel.send('Server bạn đang nằm trong blacklist, vui lòng liên hệ owner của bot hoặc vào support server tại: https://top.gg/bot/645883401500622848');
        logging(`${message.author.tag} || ${command.name} || ${message.guild.name}(${message.guild.id})`);
        command.run(client, message, args, serverData);
    }
};

const moment = require('moment-timezone');
function logging(content) {
    if (TYPE_RUN !== 'production') return;
    log(`${moment.tz(timezone).format("DD/MM/YYYY hh:mm:ss")} || ${content}`);
}

async function reset_afk(id) {
    if (!id) throw new Error('Thiếu ID');
    return await afkData.set(id, { afk: false, loinhan: '' });
}

function errnoitu(message, string) {
    message.react('❌');
    return message.reply(string);
}

function isInChannel(message, serverData, channelID, type) {
    const { author, content, channel } = message;
    const prefix = serverData.prefix;
    const result = !content.startsWith(prefix) && channel.id == channelID && !content.match(/[<`~+{}?|>#$%^&*();@]/g) && content.length != 0 && !author.bot;
    if (type == 'noichu' && message.content.includes(' ')) return false;
    return result;
}


function checkMsgPerm(client, message) {
    const botPerms = message.channel.permissionsFor(client.user);
    if (!botPerms) return true;
    return botPerms.has(['SEND_MESSAGES']);
}