const Pool = require('../database/dbConnection');

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
    // GRAPHQL plays nice with promises, so returning a promise handles asyncronicity
    // returns all addresses
    addresses: () => {
      // console.log('addresses queried');
      const query = 'SELECT * FROM addresses';
      return Pool.query(query)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP ADDRESSES', err));
    },
    customer: (parent, args) => {
      const query = 'SELECT * FROM customers WHERE id = $1 LIMIT 1';
      const values = [args.id];
      return Pool.query(query, values)
        .then((data) => {
          // TODO: FIX: this is a kind of janky work around to get the address for this user
          // const address = resolvers.Query.address(null, { id: data.rows[0].addressId });
          // then spread the data row out into a new object with the address
          // return { ...data.rows[0], address };
          console.log(data.rows[0]);
          return data.rows[0];
        })
        .catch((err) => console.log('ERROR LOOKING UP CUSTOMER', err));
    },
    // getting nested data (addresses of customers) is a little tricky...
    customers: () => {
      const query = 'SELECT * FROM customers';
      return Pool.query(query)
        .then((data) => data.rows) // this will not return addresses of each customer
        .catch((err) => console.log('ERROR LOOKING UP CUSTOMERS', err));
    },
  },
  // a type def which is useful for defining the nested GQL definitions in a schema
  // this one sets the address key/parameter of a Customer
  Customer: {
    address: (args) => Pool.query('SELECT * FROM addresses WHERE id = $1 LIMIT 1', [args.addressId])
      .then((data) => data.rows[0]),
  },
};


module.exports = resolvers;
