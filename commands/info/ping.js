const { MessageEmbed } = require('discord.js');
const { getPing } = require('../../functions/economy');
const axios = require('axios');
module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping",
    usage: "<PREFIX>ping",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging....`);
        try {
            data = IPDATA;
            const mongoPing = await getPing();
            const response = await axios.get('https://srhpyqt94yxb.statuspage.io/api/v2/components.json');
            let api = response.data.components.filter(el => el.name == "API");
            api = api[0];
            const embed = new MessageEmbed()
                .addField('Độ trễ (bot):', `${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms`, true)
                .addField('Độ trễ (API): ', `${client.ws.ping}ms`, true)
                .addField('Độ trễ (MongoDB): ', [
                    `Read: ${mongoPing.read}ms`,
                    `Write: ${mongoPing.write}ms`,
                    `Avg: ${mongoPing.average}ms`,
                ])
                .addField('Discord API status: ', api.status, true)
                .addField('Vị trí hosting: ', `${data.city}, ${data.regionName}, ${data.countryCode}`, true);
            msg.edit('Pong! 🏓', embed);
        }
        catch(e) {
            console.log(e);
            return msg.edit(`Pong! \`${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\``);
        }
    },
};