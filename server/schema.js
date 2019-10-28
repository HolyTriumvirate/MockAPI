// const { buildSchema } = require('graphql');

// re-write to make this just a typedef
module.exports = `
  # types are similar to classes or schemas, they tell GQL what types to expect at each variable
  # they should reflect the database schema/setup VERY closely (if not identically)
  type Customer {
    # NOTE: hashtags(#) are used for comments
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    address: Address!
  }

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
  type Query {
    address(id: Int!): Address! 
    addresses: [Address!]! # iterable of addresses where no element can be null
    customer(id: Int!): Customer!
    customers: [Customer!]!
  }
`;
