const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// start a new pool of connections
const pool = new Pool({
  // update these to a .env file...
  database: process.env.PSQL_DATABASE,
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  host: process.env.PSQL_HOST,
  port: 5432,
  ssl: true,
  max: 4, // max on free plan for elephantSQL if 5, lowering it seems to avoid some issues...🤷‍♂️
  min: 1,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
});

// pool.connect().then((connectionResult) => console.log(connectionResult));

module.exports = pool;
