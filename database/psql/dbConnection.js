const { Pool } = require('pg');
const dotenv = require('dotenv');

// create a link to the .env file for sensitive info (db passwords)
dotenv.config();

// start a new pool of connections
const pool = new Pool({
  database: process.env.PSQL_DATABASE,
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  host: process.env.PSQL_HOST,
  port: 5432,
  ssl: true,
  // max on free plan for elephantSQL if 5, lowering it seems to avoid some connection issues...🤷‍♂️
  max: 4,
  min: 1,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
});

// initial test if pool was working
// pool.connect().then((connectionResult) => console.log(connectionResult));

// export the pool, it can be queried directly, or clients/connections can be "checked out",
// the connection/client can be queried, and then "released"
module.exports = pool;
