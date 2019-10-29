const Base = require('../baseSchema');
const Address = require('../address/addressSchema');

const Customer = `
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

  extend type Query {
    customer(id: Int!): Customer!
    customers: [Customer!]!
  }

  extend type Mutation {
    addCustomerAndAddress(
      firstName: String!, 
      lastName: String!, 
      email: String!, 
      phoneNumber: String!,
      
      # address details
      address: String!,
      address2: String,
      city: String,
      state: String!,
      zipCode: String!): Customer!

    updateCustomer(
      id: Int!,
      firstName: String, 
      lastName: String, 
      email: String, 
      phoneNumber: String
      ): Customer!

    # deletes customer AND associated address
    deleteCustomer(
      id: Int! # customer id
    ): Int!
    }
`;
module.exports = () => [Customer, Address, Base];
