const Base = require('../baseSchema');

const Address = `
  type Address {
    id: Int!
    address: String!
    address2: String # the second line of an address is optional (no exclaimation point)
    city: String!
    state: String!
    zipCode: String! # this was made a string due to how faker (npm package) produces zipcodes
  }

  # Queries define what endpoints the user can query from
  # the keys inside of the parameters are arguments (which are used in the resolver functions)

  extend type Query {
    address(id: Int!): Address! 
    addresses: [Address!]! # iterable of addresses where no element can be null
  }

  extend type Mutation {
    updateAddress(
      customerId: Int!,
      address: String,
      address2: String,
      city: String,
      state: String,
      zipCode: String): Address!
  }
  `;

module.exports = () => [Address, Base];
