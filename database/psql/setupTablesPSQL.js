const Pool = require('./dbConnection');

// note: sql queries cannot have trailing commas for the last argument (like in js)
// function that will create each table and then add necessary constraints
async function setup() {
  // setup the customer table
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
    `).then(() => console.log('customers table made')); // notify the console on completion

  // setup the addresses table
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
    `).then(() => console.log('addresses table made')); // notify the console on completion


  // add foregin key constraint, this will throw an error if the previous queries are not
  // awaited because the tables won't exist yet
  console.log('setting up addresses_customer constraint...');
  await Pool.query(`
    ALTER TABLE customers
    ADD CONSTRAINT addressConstraint
    FOREIGN KEY ("addressId")
    REFERENCES addresses (id)
    ON DELETE CASCADE
    `).then(() => console.log('constraint added\n')); // shoot a message to the console
}

// invoke setup function
setup();
