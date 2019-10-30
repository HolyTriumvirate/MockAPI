/**
 * This file is used as the first step of resetting the psql database.
 * It drops the two tables in the psql database.
 */

const Pool = require('./dbConnection');

// using an async function to ensure that these two drops occur before the next script is run.
async function resetDb() {
  console.log('resetting psql database...');
  await Pool.query('DROP TABLE customers').then(() => console.log('customers table dropped'));
  await Pool.query('DROP TABLE addresses').then(() => console.log('addresses table dropped\n'));
}

resetDb();
