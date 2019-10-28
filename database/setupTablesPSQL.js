const Pool = require('./dbConnection');

// note: cannot have trailing commas for the last argument (like in js)
async function setup() {
  console.log('setting up customers table...');

  await Pool.query(`
  CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY, 
    "firstName" VARCHAR(255) NOT NULL, 
    "lastName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "addressId" INT,
    "phoneNumber" VARCHAR(40)
    )
    `).then(() => console.log('customers table made'));

  console.log('setting up addresses table...');
  await Pool.query(`
  CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY, 
    "address" VARCHAR(255) NOT NULL, 
    "address2" VARCHAR(255),
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "zipCode" VARCHAR(10) NOT NULL
    )
    `).then(() => console.log('addresses table made'));

  console.log('setting up addresses_customer constraint...');
  // add foregin key constraint (only need to do this once)
  // then again this entire file only needs to be run once...
  await Pool.query(`
    ALTER TABLE customers
    ADD CONSTRAINT addressConstraint
    FOREIGN KEY ("addressId")
    REFERENCES addresses (id)
    `).then(() => console.log('constraint added'));
}

setup();
