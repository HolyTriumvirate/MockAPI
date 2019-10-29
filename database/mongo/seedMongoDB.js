const faker = require('faker'); // npm package for making fake data
// const mongoose = require('mongoose'); // disconnecting isn't working b/c of async shit
const mongoConnection = require('./dbConnection');

console.log('Seeding MongoDB with random carts for 25 customers');

const seed = async () => {
  const { CartModel } = await mongoConnection();

  for (let i = 0; i < 25; i++) {
    // create a products array of 0 - 3 items
    const productsArray = [
      Math.random() > 0.5 ? faker.commerce.productName() : '',
      Math.random() > 0.5 ? faker.commerce.productName() : '',
      Math.random() > 0.5 ? faker.commerce.productName() : '',
    ].filter((ele) => ele !== '');
      // console.log(productsArray);

    // if cart is empty, skip them
    if (productsArray.length) {
      CartModel.create({
        customerId: i,
        // three random products
        products: productsArray,
      }, (err, data) => {
        if (err) console.log('ERROR CREATING CARTS: ', err);
        console.log('CART ADDED: ', data);
      });
    } else {
      console.log('SKIPPED CART FOR CUSTOMER: ', i);
    }
  }
};

seed();

// TODO add a disconnect here so I can stop terminating (ctrl + c) out of the terminal
