const ascii = require('ascii-table');
const fs = require('fs');
const { join } = require('path');
const table = new ascii('Events');
table.setHeading('Event name', 'Status');
module.exports = (client, dir = 'events') => {
    let count = 0;
    const files = fs.readdirSync(join(__dirname, '..', dir));
    for (const file of files) {
        if (file.endsWith('.js')) {
            const eventName = file.substring(0, file.indexOf('.js'));
            try {
                const eventModule = require(join(__dirname, '..', dir, file));
                client.on(eventName, eventModule.bind(null, client));
                count++;
                table.addRow(eventName, '✅');
            }
            catch(err) {
                console.error(err);
                table.addRow(eventName, '❌');
                continue;
            }
        }
    }
    console.log(table.toString());
    console.log(`${count} events đã sẵn sàng hoạt động!`);
};