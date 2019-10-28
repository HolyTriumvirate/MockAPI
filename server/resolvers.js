// const Pool = require('../database/dbConnection');
// This is commented out for a refactor to use context (refer to server/server.js)

// NOTE: GRAPHQL plays nice with promises, so returning a promise handles asyncronicity

module.exports = {
  // the Query key sets all allowable queries that the user can make
  // queries are basically "Read" functionality
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
    // 1. the parent/previous value (the Customer is the parent of the address property)
    // 2. arguments, I'm not sure where these get passed, but it may be the same
    //    arguemnts that were passed into the Customer query
    // 3. context (the databse connection in this case)
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
  // mutations include Create Update and Delete functionality
  Mutation: {
    addCustomerAndAddress: (parent, args, { psqlPool }) => {
      // destructuring the arguments
      const {
        firstName, lastName, email, phoneNumber,
        address, address2, city, state, zipCode,
      } = args;

      // big ass query to add an address and user at the same time
      const query = `WITH newAddress AS (
        INSERT INTO addresses("address", "address2", "city", "state", "zipCode") 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      )
      INSERT INTO customers("firstName", "lastName", "email", "addressId", "phoneNumber")
      VALUES ($6, $7, $8, (SELECT id FROM newAddress), $9)
      RETURNING *`;
      // initializing values array
      const values = [
        address, address2, city, state, zipCode,
        firstName, lastName, email, phoneNumber,
      ];

      // return the async query to the database
      return psqlPool.query(query, values)
        .then((res) => res.rows[0])
        .catch((err) => console.log('ERROR ADDING CUSTOMER AND ADDRESS TO DATABASE: addCustomerAndAddress Mutation', err));
    },

    // new key-value pair = new mutation type/exposes endpoint
    updateCustomer: (parent, args, { psqlPool }) => {
      // initialize the query statement
      let query = 'UPDATE customers SET ';
      // initialize the values array which will have the id as the first argument
      const values = [args.id];
      let count = 2; // count will track which item in the array needs to be referenced in SQL

      // iterate through each element in the arguments and add to the query and values variables
      Object.keys(args).forEach((e) => {
        if (e !== 'id' && args[e]) { // omit id and null arguments
          query += `"${e}"= $${count}, `;
          count += 1;
          values.push(args[e]);
        }
      });

      // remove the last comma off the query
      query = query.slice(0, query.length - 2);

      // add in selector w/ first item in array being the id from args
      query += ' WHERE id = $1 RETURNING *';
      // console.log(query, values);
      // return the async call to the psql database
      return psqlPool.query(query, values)
        .then((res) => res.rows[0])
        .catch((err) => console.log('ERROR UPDATING CUSTOMER INFORMATION: updateCustomer Mutation', err));
    },

    updateAddress: (parent, args, { psqlPool }) => {
      // initialize the query statement
      let query = `WITH foundAddress AS (
        SELECT "addressId" as id 
        FROM customers 
        WHERE id = $1
        )
        UPDATE addresses SET 
        `;

      // initialize the values array which will have the id as the first argument
      const values = [args.customerId];
      let count = 2; // count will track which item in the array needs to be referenced in SQL

      // iterate through each element in the arguments and add to the query and values variables
      Object.keys(args).forEach((e) => {
        if (e !== 'customerId' && args[e]) { // omit id and null arguments
          query += `"${e}"= $${count}, `;
          count += 1;
          values.push(args[e]);
        }
      });

      // remove the last comma off the query
      query = query.slice(0, query.length - 2);

      // add in selector w/ first item in array being the id from args
      query += ' WHERE id = (SELECT id FROM foundAddress) RETURNING *';

      // console.log(query, values);
      return psqlPool.query(query, values)
        .then((res) => res.rows[0])
        .catch((err) => console.log('ERROR WHILE UPDATING CUSTOMER\'S ADDRESS: updateAddress Mutation', err));
    },
  },
};
