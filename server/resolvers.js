const Pool = require('../database/dbConnection');

// NOTE: GRAPHQL plays nice with promises, so returning a promise handles asyncronicity

const resolvers = {
  // the Query key sets all allowable queries that the user can make
  Query: {
    // select a single address via id
    address: (parent, args) => {
      // set query text and values (id from arguments obj)
      const query = 'SELECT * FROM addresses WHERE id = $1 LIMIT 1';
      const values = [args.id];
      // return the async query to the d-base, parse out the only row that is returned
      return Pool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR GETTING AN ADDRESS', err));
    },

    // returns all addresses
    addresses: () => {
      // console.log('addresses queried');
      const query = 'SELECT * FROM addresses';
      return Pool.query(query)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP ADDRESSES', err));
    },

    // returns a single customer's information
    customer: (parent, args) => {
      const query = 'SELECT * FROM customers WHERE id = $1 LIMIT 1';
      const values = [args.id];
      return Pool.query(query, values)
        // setting the address is handled by the Customer type resolver below (built into GQL)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR LOOKING UP CUSTOMER', err));
    },

    // returns all customers' information
    customers: () => {
      const query = 'SELECT * FROM customers';
      return Pool.query(query)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP CUSTOMERS', err));
    },
  },

  // this is a type resolver which is useful for defining the nested GQL definitions in a schema
  // this one sets the address key/parameter of a Customer
  Customer: {
    address: (args) => {
      const query = 'SELECT * FROM addresses WHERE id = $1 LIMIT 1';
      const values = [args.addressId];
      // return the async query to find the address with the appropriate addressId
      return Pool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR GETTING CUSTOMER\'S ADDRESS', err));
    },
  },
};


module.exports = resolvers;
