const {
  Query: CustomerQuery,
  Mutation: CustomerMutation,
  Customer,
} = require('./customer/customerResolver');

const {
  Query: AddressQuery,
  Mutation: AddressMutation,
} = require('./address/addressResolver');

const {
  Query: CartQuery,
  Mutation: CartMutation,
} = require('./cart/cartResolver');

module.exports = {
  Query: { ...CustomerQuery, ...AddressQuery, ...CartQuery },
  Mutation: { ...CustomerMutation, ...AddressMutation, ...CartMutation },
  Customer,
};
