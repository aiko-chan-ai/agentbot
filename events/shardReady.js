const SQLite = require('better-sqlite3');
const sql = new SQLite('./data.sqlite');
const publicIP = require('public-ip');
const axios = require('axios');

module.exports = async (client, id) => {
    console.log(`Shard id ${id} is ready!`);
    // database
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'xpdata';").get();
    if (!table['count(*)']) {
      sql.prepare("CREATE TABLE xpdata (id TEXT PRIMARY KEY, user TEXT, guild TEXT, xp INTEGER, level INTEGER);").run();
      sql.prepare("CREATE UNIQUE INDEX idx_xpdata_id ON xpdata (id);").run();
      sql.pragma("synchronous = 1");
      sql.pragma("journal_mode = wal");
    }
    client.getScore = sql.prepare("SELECT * FROM xpdata WHERE user = ? AND guild = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO xpdata (id, user, guild, xp, level) VALUES (@id, @user, @guild, @xp, @level);");

    const myIP = await publicIP.v4();
    const res = await axios.get(`http://ip-api.com/json/${myIP}`);
    global.IPDATA = res.data;
};