module.exports = {
  Query: {
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
      // using pool.connect to create an individual connection to the database, because
      // there are some nested queries in the type resolver. This limits the number of
      // connections to the pool to avoid "too many connections" errors
      return context.psqlPool.connect()
        .then((client) => client.query(query)
          .then((data) => {
            client.release();
            return data.rows;
          })
          .catch((err) => {
            client.release();
            console.log('ERROR LOOKING UP CUSTOMERS', err);
          }))
        .catch((err) => console.log('ERROR IN customers Query', err));
    },
  },
  Mutation: {
    // replacement for addCustomerAndAddress to only add the user to the psql database
    addCustomer: (parent, args, { psqlPool }) => {
      const {
        firstName, lastName, email, phoneNumber,
      } = args;
      const query = `INSERT INTO customers ("firstName", "lastName", "email", "phoneNumber")
        VALUES ($1, $2, $3, $4)
        RETURNING *;`;
      const values = [firstName, lastName, email, phoneNumber];
      return psqlPool.query(query, values)
        .then((res) => res.rows[0])
        .catch((err) => console.log('ERROR ADDING CUSTOMER TO DB addCustomer mutaiton', err));
    },

    // deprecated addCustomerAndAddress because in a real app the customer info is added,
    // and address is added upon their first order
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
    deleteCustomer: (parent, args, { psqlPool }) => {
      // only need to delete the address row because cascading delete is TRUE
      const query = `DELETE FROM addresses
          WHERE addresses.id = (
            SELECT id FROM customers 
            WHERE id = $1
          )`;

      // setup the values array
      const values = [args.id];

      // console.log(query, value);
      return psqlPool.query(query, values)
        .then((res) => res.rowCount)
        .catch((err) => console.log('ERROR DELETING USER & ADDRESS: deleteCustomer Mutation', err));
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
      // also using the connect method here to control the number of connections to the pool
      return context.psqlPool.connect()
        .then((client) => client.query(query, values)
          .then((data) => {
            client.release();
            return data.rows[0];
          })
          .catch((err) => {
            // release the client regardless of error or not, or else the pool will "drain"
            client.release();
            console.log('ERROR GETTING CUSTOMER\'S ADDRESS', err);
          }))
        .catch((err) => console.log('ERROR IN Customer Type Resolver', err));
    },
  },
};
