const Pool = require('./dbConnection');

async function resetDb() {
  console.log('resetting psql database...');
  await Pool.query('DROP TABLE customers').then(() => console.log('customers table dropped'));
  await Pool.query('DROP TABLE addresses').then(() => console.log('addresses table dropped\n'));
}

resetDb();
