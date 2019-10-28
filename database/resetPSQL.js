const Pool = require('./dbConnection');

async function resetDb() {
  await Pool.query('DROP TABLE customers');
  await Pool.query('DROP TABLE addresses');
}

resetDb();
