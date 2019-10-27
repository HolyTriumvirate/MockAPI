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
  max: 5, // max on free plan for elephantSQL
  min: 1,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
});

// pool.connect().then((connectionResult) => console.log(connectionResult));

// pool.query('SELECT * FROM films;')
//   .then((data) => {
//     console.log(data.rows);
//   })
//   .catch((err) => console.log(err));

module.exports = pool;
