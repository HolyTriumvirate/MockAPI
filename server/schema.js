const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Customer {
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
    address2: String
    city: String!
    state: String!
    zipCode: String!
  }

  type Query {
    address(id: Int!): Address! 
    addresses: [Address!]!
    customer(id: Int!): Customer!
    customers: [Customer!]!
  }
`);
