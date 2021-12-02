const { log } = require('../functions/log');
module.exports = (client, err) => {
    sendOwner(`Bot lỗi: ${err.message}`);
    log(err);
};

async function sendOwner(content) {
    if (!content || TYPE_RUN !== 'production') return;
    const owner = await client.users.fetch(ownerID);
    owner.send(content, { split: true, code: true });
}