const { Pool } = require('pg');

// start a new pool of connections
const pool = new Pool({
  // update these to a .env file...
  database: 'udfuhfqp',
  user: 'udfuhfqp',
  password: 'qVUVe6UoD3xUTZkc9n3ac5gkDzQAQWbc',
  host: 'salt.db.elephantsql.com',
  port: 5432,
  ssl: true,
  max: 4, // max on free plan for elephantSQL if 5, lowering it seems to avoid some issues...🤷‍♂️
  min: 1,
  idleTimeoutMillis: 2000,
  connectionTimeoutMillis: 2000,
});

// pool.connect().then((connectionResult) => console.log(connectionResult));

// pool.query('SELECT * FROM films;')
//   .then((data) => {
//     console.log(data.rows);
//   })
//   .catch((err) => console.log(err));

module.exports = pool;
