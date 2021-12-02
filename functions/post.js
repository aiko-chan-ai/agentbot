const { create, BinFile } = require('sourcebin-wrapper');
module.exports = {
    post: async function(content) {
        const res = await create([
            new BinFile({
                name: 'log.js',
                content: content,
                languageId: 'js',
            }),
        ]);
        return res.shortened;
    },
};