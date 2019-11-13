const Pool = require('./dbConnection');

async function seedCustomerOrders() {
  // create an array of variables to be inserted into the database
  const values = [
    76 + Math.ceil(Math.random() * 115),
    Math.ceil(Math.random() * 15),
    Math.ceil(Math.random() * 25),
  ];

  // console.log('full input array is', values);

  await Pool.query(`
    INSERT INTO "orderProducts"("productId", "productQty", "orderId")
    VALUES ($1, $2, $3)
    RETURNING *
    `, values)
    .then((newRow) => console.log(`NEW PRODUCT FOR ORDER: ${newRow.rows[0].productId}`))
    .catch((err) => console.log('ERROR ADDING ORDER PRODUCT (THIS IS SOMEWHAT EXPECTED FOR SEEDING SCRIPT)', err));
}

// seed with a random number of inputs
// const random = Math.random() * 25;
// console.log(`Seeding ${Math.floor(random) + 1} values`);
console.log('Seeding customerOrders');

// // seems to be fixed:
// // EXPECT ERRORS HERE as js will create a lot of pool connections faster than they can be handled
// create the 25 customers in the database
for (let i = 0; i < 100; i++) {
  seedCustomerOrders();
}

// this isn't logging in the right spot because of async activity...
// TODO I can fix this with a promise all that's fed the seed function...
// TODO ...there are more important battles right now
// Note: this actually isn't too far off because seed runs asyncronously and each
// query is being awaited separately
// Pool.query('SELECT COUNT(*) FROM customers')
//   .then((result) => console.log('The total customer count is', result.rows[0].count));
