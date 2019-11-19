const { Pool } = require('pg');

const yourUsername = 'chao';
const yourPassword = 'Potato26!!';

// start a new pool of connections
const pool = new Pool({
  connectionString: `postgres://${yourUsername}:${yourPassword}!!@localhost/graphquillmockapi`,
});

// export the pool, it can be queried directly, or clients/connections can be "checked out",
// the connection/client can be queried, and then "released"
module.exports = pool;
