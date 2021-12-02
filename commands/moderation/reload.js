const handler = require('../../handlers/command');
module.exports = {
    name: 'reload',
    description: 'reload command',
    ownerOnly: true,
    run: async (client, message, args) => {
        await client.commands.clear();
        await client.aliases.clear();
        handler(client);
        if (process.env.TYPE_RUN == 'production') client.shard.respawnAll();
        message.channel.send('Đã reload bot thành công!');
    },
};