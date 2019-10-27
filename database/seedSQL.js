const faker = require('faker');
const Pool = require('./dbConnection');

// console.log(typeof Number(faker.address.zipCode()));
async function seed() {
  // create an array of variables to be inserted into the database
  const values = [
    faker.address.streetAddress(),
    faker.address.secondaryAddress(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCode(), // this seems to sometimes throw an error when the column type is INT
    faker.name.firstName(),
    faker.name.lastName(),
    faker.internet.email(),
    faker.phone.phoneNumber(),
  ];

  // console.log('full input array is', values);

  await Pool.query(`
    WITH newAd AS (
      INSERT INTO addresses(address, "address2", city, state, "zipCode") 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    )
    INSERT INTO customers("firstName", "lastName", "email", "addressId", "phoneNumber")
    VALUES ($6, $7, $8, (SELECT id FROM newAd), $9)
    RETURNING *
    `, values)
    .then((newRow) => console.log('new customer details', newRow.rows))
    .catch((err) => console.log('ERROR ADDING CUSTOMER AND/OR ADDRESS', err));
}

// seed a random number of times
const random = Math.random() * 10;
console.log(`Seeding ${Math.floor(random) + 1} values`);

// EXPECT ERRORS HERE as js will create a lot of pool connections faster than they can be handled
for (let i = 0; i < random; i++) {
  seed();
}

Pool.query('SELECT COUNT(*) FROM customers')
  .then((result) => console.log('customer count is', result.rows[0].count));
