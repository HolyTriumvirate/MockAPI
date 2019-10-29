const {
  Query: CustomerQuery,
  Mutation: CustomerMutation,
  Customer,
} = require('./customer/customerResolver');

const {
  Query: AddressQuery,
  Mutation: AddressMutation,
} = require('./address/addressResolver');

module.exports = {
  Query: { ...CustomerQuery, ...AddressQuery },
  Mutation: { ...CustomerMutation, ...AddressMutation },
  Customer,
};
