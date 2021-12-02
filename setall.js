const db = require('quick.db');
const allDb = db.all();

for (let i = 0; i < allDb.length; i++) {
    const guild = allDb[i].ID;
    try {
        if (!db.has(`${guild}.rankChannel`)) db.set(`${guild}.rankChannel`, 'default');
    } catch(e) {
        console.log(e.message);
        continue;
    }

}

console.log('Applied new database!');