// const Pool = require('../database/dbConnection');
// This is commented out for a refactor to use context (refer to server/server.js)

// NOTE: GRAPHQL plays nice with promises, so returning a promise handles asyncronicity

module.exports = {
  // the Query key sets all allowable queries that the user can make
  Query: {
    // select a single address via id
    address: (parent, args, context) => {
      // set query text and values (id from arguments obj)
      const query = 'SELECT * FROM addresses WHERE id = $1 LIMIT 1';
      const values = [args.id];
      // return the async query to the d-base, parse out the only row that is returned
      return context.psqlPool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR GETTING AN ADDRESS', err));
    },

    // returns all addresses
    addresses: (parent, args, { psqlPool }) => {
      // alternatively, context can be destructured, but I find it less readable
      // console.log('addresses queried');
      const query = 'SELECT * FROM addresses';
      return psqlPool.query(query)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP ADDRESSES', err));
    },

    // returns a single customer's information
    customer: (parent, args, context) => {
      const query = 'SELECT * FROM customers WHERE id = $1 LIMIT 1';
      const values = [args.id];
      return context.psqlPool.query(query, values)
        // setting the address is handled by the Customer type resolver below (built into GQL)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR LOOKING UP CUSTOMER', err));
    },

    // returns all customers' information
    customers: (parent, args, context) => {
      const query = 'SELECT * FROM customers';
      return context.psqlPool.query(query)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP CUSTOMERS', err));
    },
  },

  //* This is a type resolver which is useful for defining the nested GQL definitions in a schema
  // this one sets the address key/parameter of a Customer (to the info of an Address TYPE)
  Customer: {
    // the parameters for the resolver function in a type resolver are:
    //
    address: (parent, args, context) => {
      const query = 'SELECT * FROM addresses WHERE id = $1 LIMIT 1';
      const values = [parent.addressId];
      // return the async query to find the address with the appropriate addressId
      return context.psqlPool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR GETTING CUSTOMER\'S ADDRESS', err));
    },
  },

  // all the possible mutation endpoints
  Mutation: {
    addCustomerAndAddress: (parent, args, { psqlPool }) => {
      const {
        firstName, lastName, email, phoneNumber,
        address, address2, city, state, zipCode,
      } = args;
      const query = `WITH newAddress AS (
        INSERT INTO addresses("address", "address2", "city", "state", "zipCode") 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      )
      INSERT INTO customers("firstName", "lastName", "email", "addressId", "phoneNumber")
      VALUES ($6, $7, $8, (SELECT id FROM newAddress), $9)
      RETURNING *`;
      const values = [
        address, address2, city, state, zipCode,
        firstName, lastName, email, phoneNumber,
      ];
      return psqlPool.query(query, values).then((res) => res.rows[0]);
    },
  },
};
