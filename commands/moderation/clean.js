module.exports = {
    name: 'clean',
    category: 'moderation',
    description: 'Dọn dẹp tin nhắn từ bot',
    usage: '<PREFIX>clean',
    run: async (client, message, args) => {
        if (message.deletable) await message.delete();
        message.channel.messages.fetch({
            limit: 50,
        }).then(async messages => {
            messages = messages.filter(msg => msg.author.id === client.user.id).array();
            await message.channel.bulkDelete(messages, true);
            await message.channel.send('👍').then(m => m.delete({ timeout: 10000 }));
        });
    },
};