const { MessageEmbed } = require("discord.js");
const axios = require('axios');
const moment = require('moment');
const db = require('quick.db');
const steamDB = new db.table('steamdb');
const { STEAMTOKEN } = process.env;
const { parse } = require('url');
const isURL = require('is-url');
module.exports = {
    name: "steam",
    category: "info",
    description: "Tra thông tin steam.",
    usage: "<PREFIX>steam [set] <ID 64, link steam>",
    example: "<PREFIX> steam 76561198282352473",
    run: async (client, message, args, serverData) => {
        const embed = new MessageEmbed();
        let userInput = args[0];
        let steamID;
        if (!userInput) {
            if (steamDB.has(message.author.id)) userInput = await steamDB.get(message.author.id);
            else return message.channel.send(invalid_input(embed));
        } else if (userInput.toLowerCase() == 'set') {
            if (!args[1]) return message.channel.send('Nhập steamID hoặc link steam để bot lưu!');
            steamID = await xuly(args[1]);
            steamDB.set(message.author.id, steamID);
            return message.react('✅');
        }
        steamID = await xuly(userInput);
        const publicInfo = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAMTOKEN}&steamids=${steamID}`);
        if (publicInfo.data.response.players.length == 0) return message.channel.send(invalid_input(embed));
        const { gameextrainfo, personaname, avatarfull, timecreated, loccountrycode, personastate, realname, profileurl, steamid } = publicInfo.data.response.players[0];
        const state = ["Offline", "Online", "Busy", "Away", "Snooze", "Looking to trade", "Looking to play"];
        embed.setAuthor(`${personaname} (${steamid})`)
            .setColor('#00ffff')
            .setTitle('Link tới profile')
            .setURL(profileurl)
            .setThumbnail(avatarfull)
            .addField('Thông tin cá nhân', [
                `Tên đầy đủ: ${realname || "Không có"}`,
                `Trạng thái: ${state[personastate]}`,
                `Quốc gia: :flag_${loccountrycode ? loccountrycode.toLowerCase() : "white"}:`,
                `Ngày tạo steam: ${moment.unix(timecreated).format("DD/MM/YYYY")}`,
                `${gameextrainfo ? `Đang chơi: ${gameextrainfo}` : ""}`,
        ]);
        const vacban = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${STEAMTOKEN}&steamids=${steamID}`);
        const { NumberOfVACBans, NumberOfGameBans } = vacban.data.players[0];
            embed.addField('Thông tin VAC', [
                `Số lần bị VAC Ban: ${NumberOfVACBans}`,
                `Số lần bị Game Ban: ${NumberOfGameBans}`,
            ])
            .setFooter(`${serverData.prefix}steam set <ID, link steam> để lưu lại!`);
        message.channel.send(embed);
    },
};

function invalid_input(embed) {
    embed.setTitle('Hãy nhập SteamID 64 của bạn')
        .setDescription('Nếu bạn không biết steamID của mình hãy [click vào đây](https://steamid.io/)');
    return embed;
}

async function fetchVanity(vanityID) {
    try {
        const res = await axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAMTOKEN}&vanityurl=${vanityID}`);
        const { success, steamid } = res.data.response;
        if (success != 1 || !steamid) return null;
        return steamid;
    }
    catch(err) {
        return null;
    }
}

function rutgonURL(pathname, toReplace) {
    if (!pathname || !toReplace) return null;
    return pathname.replace(/\//g, '').replace(toReplace, '');
}

async function getID(userInput) {
    let steamID;
    let type;
    const path = parse(userInput).path;
    if (path.includes('id')) {
        steamID = await fetchVanity(rutgonURL(path, 'id'));
        type = 'vanity';
    }
    else if (path.includes('profiles')) {
        steamID = rutgonURL(path, 'profiles');
        type = 'id';
    }
    return {
        steamID: steamID,
        type: type,
    };
}

async function xuly(userInput) {
    if (!userInput) return null;
    let steamID;
    if (isURL(userInput)) {
        const data = await getID(userInput);
        steamID = data.steamID;
    }
    else if (isNaN(userInput)) steamID = await fetchVanity(userInput);
    else steamID = userInput;
    return steamID;
}