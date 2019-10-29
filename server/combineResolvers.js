const {
  Query: CustomerQuery,
  Mutation: CustomerMutation,
  Customer,
} = require('./customerResolver');

const {
  Query: AddressQuery,
  Mutation: AddressMutation,
} = require('./addressResolver');

module.exports = {
  Query: { ...CustomerQuery, ...AddressQuery },
  Mutation: { ...CustomerMutation, ...AddressMutation },
  Customer,
};
