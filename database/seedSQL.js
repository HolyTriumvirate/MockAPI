const faker = require('faker');
const Pool = require('./dbConnection');

// console.log(typeof Number(faker.address.zipCode()));
async function seed() {
  // test inserting into address table
  const fakerAddressValues = [
    faker.address.streetAddress(),
    faker.address.secondaryAddress(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCode(), // this seems to sometimes throw an error when the column type is INT
  ];

  let newAddressId;

  // this feels like a very hacky way to do this... there's probably a way to do this with one query
  // THIS IS ALSO NOT ACID Compliant right now because an error can lead to a null foregin key value
  await Pool.query(`
    INSERT INTO addresses(address, "address2", city, state, "zipCode") 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, fakerAddressValues)
    // set the newAddressId variable to this newId to be used when added the next user
    .then((newRow) => { newAddressId = newRow.rows[0].id; })
    .catch((err) => console.log('error adding address', err));

  // create an array of variables to be inserted into the database
  const customerArr = [
    faker.name.firstName(),
    faker.name.lastName(),
    faker.internet.email(),
    newAddressId,
    faker.phone.phoneNumber(),
  ];

  // console.log(fakerValues.concat(customerArr));

  await Pool.query(`
    INSERT INTO customers("firstName", "lastName", "email", "addressId", "phoneNumber")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, customerArr)
    .then((newRow) => console.log('new customer\'s first name', newRow.rows[0].firstName))
    .catch((err) => console.log('error adding customer', err));


  // await Pool.query('SELECT * FROM addresses').then((data) => console.log(data.rows));
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
