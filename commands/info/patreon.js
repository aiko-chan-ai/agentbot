module.exports = {
    name: 'patreon',
    category: 'info',
    description: 'Link patreon xD',
    usage: '<PREFIX>patreon',
    run: async (client, message, args) => {
        message.channel.send('https://www.patreon.com/AgentBot');
    },
};