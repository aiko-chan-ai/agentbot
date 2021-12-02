const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { findBestMatch } = require('string-similarity');
const db = require('quick.db');

module.exports = {
    getMember: async function(message, toFind = '', authorReturn = true) {
        if (!toFind) return authorReturn ? message.member : null;
        toFind = toFind.toLowerCase();
        let target = await message.guild.members.fetch({ user: toFind }).catch(() => undefined);
        if (!target && message.mentions.members) target = message.mentions.members.first();
        if (!target && toFind) {
            target = await message.guild.members.fetch({ query: toFind, limit: 1 });
            target = target[0];
        }
        if (!target) target = authorReturn ? message.member : null;
        return target;
    },

    getChannel: async function(message, toFind, sameChannelReturn = true) {
        if (!toFind) return sameChannelReturn ? message.channel : null;
        let channel = await message.guild.channels.resolve(toFind.startsWith('<#') ? toFind.slice(2, toFind.length - 1) : toFind);
        if (!channel) {
            const listChannel = message.guild.channels.cache.filter(c => c.type == 'text').map(ch => ch.name);
            const matches = findBestMatch(toFind, listChannel);
            if (matches.bestMatch.rating > 0.6) channel = message.guild.channels.cache.find(ch => ch.name == matches.bestMatch.target);
        }
        if (!channel && sameChannelReturn) return message.channel;
        return channel;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date);
    },

    promptMessage: async function(message, author, time, validReactions) {
        time *= 1000;
        for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;
        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    pages: function(arr, itemsPerPage, page = 1) {
        const maxPages = Math.ceil(arr.length / itemsPerPage);
        if (page < 1 || page > maxPages) return null;
        return arr.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    },

    sleep: async function(miliseconds) {
        return new Promise((res) => setTimeout(res, miliseconds));
    },

    laysodep: function(num) {
        const pattern = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(pattern, ',');
    },

    checkemptyobject: function(obj) {
        if (!obj) return true;
        for (const key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },

    trimArray: function(arr, maxLen) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more....`);
        }
        return arr;
    },

    formatBytes: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    },

    getIDs: function(cache) {
        let result = "";
        cache.forEach(function(ele, key, map) {
            result += "money_" + key + ",";
        });
        return result.slice(0, -1);
    },

    getunplash: async function(query) {
        if (!query) throw new Error('Query is empty!');
        const unsplashapikey = process.env.UNSPLASH;
        try {
            const response = await axios.get(`https://api.unsplash.com/photos/random/`, {
                headers: { "Authorization": `Client-ID ${unsplashapikey}` },
                params: { query: query, count: 1 },
            });
            const json = response.data[0];
            const embed = new MessageEmbed()
                .setTitle('Click vào để download')
                .setURL(json.links.download)
                .setImage(json.urls.small)
                .setFooter(`Photo by ${json.user.name} at unsplash.com`);
            return embed;
        }
        catch(e) {
            return null;
        }
    },

    capitalizeWords: function(string) {
        return string.replace(/(?!^[0-9])(^|[^a-zA-Z\u00C0-\u017F\u0400-\u04FF'])([a-zA-Z\u00C0-\u017F\u0400-\u04FF])/g, function(m) {
            return m.toUpperCase();
        });
    },

    verifyWord: function(string) {
        const dict = require('../assets/json/words_dictionary.json');
        if (dict[string]) return true;
        return false;
    },

    updateNoiTu: async function(guildID, maxWords = 1500, noituChannel) {
        await db.set(`${guildID}.noitu`, noituChannel);
        await db.set(`${guildID}.noituStart`, true);
        await db.set(`${guildID}.noituArray`, []);
        await db.set(`${guildID}.maxWords`, maxWords);
        await db.set(`${guildID}.noituLastUser`, null);
    },
};