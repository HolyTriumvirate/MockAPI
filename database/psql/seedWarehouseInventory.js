const Pool = require('./dbConnection');

async function seedWarehouseInventory() {
  // create an array of variables to be inserted into the database
  const values = [
    Math.ceil(Math.random() * 250),
    Math.ceil(Math.random() * 25),
    Math.ceil(Math.random() * 2500),
  ];

  // console.log('full input array is', values);

  await Pool.connect()
    .then((client) => {
      client.query(`
        INSERT INTO "warehouseInventory"("productId", "warehouseId", quantity)
        VALUES ($1, $2, $3)
        RETURNING *
        `, values)
        .then((newRow) => console.log(`NEW INVENTORY ADDED FOR WAREHOUSE: ${newRow.rows[0].warehouseId}`))
        .catch((err) => console.log('ERROR ADDING WAREHOUSE INVENTORY', err, values))
        .finally(() => client.release());
    });
}

// seed with a random number of inputs
// const random = Math.random() * 25;
// console.log(`Seeding ${Math.floor(random) + 1} values`);
console.log('Seeding warehouse inventory');

// // seems to be fixed:
// // EXPECT ERRORS HERE as js will create a lot of pool connections faster than they can be handled
// create the 25 customers in the database
for (let i = 0; i < 25; i++) {
  seedWarehouseInventory();
}

// this isn't logging in the right spot because of async activity...
// TODO I can fix this with a promise all that's fed the seed function...
// TODO ...there are more important battles right now
// Note: this actually isn't too far off because seed runs asyncronously and each
// query is being awaited separately
// Pool.query('SELECT COUNT(*) FROM customers')
//   .then((result) => console.log('The total customer count is', result.rows[0].count));
