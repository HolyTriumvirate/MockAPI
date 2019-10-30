const Base = require('../baseSchema');

const Cart = `
  # A Cart must have a customerId, the products and wishlist can both be empty Arrays or null
  type Cart {
    customerId: Int!
    products: [String!]
    wishlist: [String!]
  }

  # Queries define what endpoints the user can query from
  # the keys inside of the parameters are arguments (which are used in the resolver functions)

  extend type Query {
    cart(customerId: Int!): Cart! 
    ### addresses: [Address!]! # iterable of addresses where no element can be null
  }

  extend type Mutation {
    createOrUpdateCart(customerId: Int!, newItem: String!): Cart!
    removeItemsFromCart(customerId: Int!, itemsToRemove: [String!]): Cart!
  }
  `;

// extend type Mutation {
//   updateAddress(
//     customerId: Int!,
//     address: String,
//     address2: String,
//     city: String,
//     state: String,
//     zipCode: String): Address!
// }
module.exports = () => [Cart, Base];
