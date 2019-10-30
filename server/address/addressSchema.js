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
    # Deprecated mutation, functionality is replaced by createOrUpdateAddress
    updateAddress(
      customerId: Int!,
      address: String,
      address2: String,
      city: String,
      state: String,
      zipCode: String): Address! @deprecated (reason: "Use \`createOrUpdateAddress\`")

    # returns the value of updated addresses in the sql database (0 or 1)
    createOrUpdateAddress(
      customerId: Int!,
      address: String!,
      address2: String,
      city: String!,
      state: String!,
      zipCode: String!): Int!
      
  }
  `;

module.exports = () => [Address, Base];
