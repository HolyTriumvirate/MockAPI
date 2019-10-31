const faker = require('faker'); // npm package for making fake data
const mongoose = require('mongoose'); // disconnecting isn't working b/c of async shit
const mongoConnection = require('./dbConnection');

console.log('Seeding MongoDB with random carts for 25 customers');
console.log('Some carts will be skipped to model empty carts');

const seed = async (count) => {
  const { CartModel } = await mongoConnection();
  console.log('in seed');
  for (let i = 0; i < count; i++) {
    // create a products array of 0 - 3 items
    const productsArray = [
      Math.random() > 0.5 ? faker.commerce.productName() : '',
      Math.random() > 0.5 ? faker.commerce.productName() : '',
      Math.random() > 0.5 ? faker.commerce.productName() : '',
    ].filter((ele) => ele !== '');
    // console.log(productsArray);

    // if cart is empty, skip them
    if (productsArray.length) {
      // eslint-disable-next-line no-await-in-loop
      await CartModel.create({
        customerId: i,
        // three random products
        products: productsArray,
      }, (err, data) => {
        if (err) console.log('ERROR CREATING CARTS: ', err);
        console.log('CART ADDED FOR CUSTOMER: ', data.customerId);
        if (i === count - 1) mongoose.disconnect(); // conditionally disconnect from database
      });
    } else {
      console.log('SKIPPED CART FOR CUSTOMER: ', i);
    }
  }
  return 'resolved';
};

seed(25);


console.log('post seed');

// // TODO add a disconnect here so I can stop terminating (ctrl + c) out of the terminal
