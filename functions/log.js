const fs = require('fs');
module.exports = {
    log: function(text) {
        const oldLine = fs.readFileSync('./log.txt', 'utf-8');
        fs.writeFileSync('./log.txt', `${oldLine}\n${text}`);
        console.log(text);
    },
};