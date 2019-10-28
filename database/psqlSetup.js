const Pool = require('./dbConnection');

// note: cannot have trailing commas for the last argument (like in js)
async function setup() {
  await Pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY, 
      "firstName" VARCHAR(255) NOT NULL, 
      "lastName" VARCHAR(255) NOT NULL,
      "email" VARCHAR(255) NOT NULL,
      "addressId" INT,
      "phoneNumber" VARCHAR(40)
    )
    `);

  await Pool.query(`
    CREATE TABLE IF NOT EXISTS addresses (
      id SERIAL PRIMARY KEY, 
      "address" VARCHAR(255) NOT NULL, 
      "address2" VARCHAR(255),
      "city" VARCHAR(255) NOT NULL,
      "state" VARCHAR(255) NOT NULL,
      "zipCode" VARCHAR(10) NOT NULL
    )
    `);

  // add foregin key constraint (only need to do this once)
  // then again this entire file only needs to be run once...
  await Pool.query(`
    ALTER TABLE customers
    ADD CONSTRAINT addressConstraint
    FOREIGN KEY ("addressId")
    REFERENCES addresses (id)
    `);
}

setup();
