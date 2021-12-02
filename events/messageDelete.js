module.exports = (client, message) => {
    if (message.author.bot) return;
    client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null,
        ID: message.id,
    });
};