// the Query key sets all allowable queries that the user can make
// queries are basically "Read" functionality
module.exports = {
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
  },

  Mutation: {
    createOrUpdateAddress: async (parent, args, { psqlPool }) => {
      const {
        customerId, address, address2, city, state, zipCode,
      } = args;

      // query for the addressId in the customers table based on args.customerId
      const query1 = `SELECT "addressId" FROM customers
        WHERE id = $1`;
      const values1 = [args.customerId];
      // console.log(query1, values1);
      const addressId = await psqlPool.query(query1, values1)
        .then((res) => {
          if (!res.rowCount) return null;
          return res.rows[0].addressId;
        });

      // if the returned addressId is null, insert a new address, otherwise
      if (!addressId) {
        const queryInsert = `WITH newAddress AS (
          INSERT INTO addresses ("address", "address2", "city", "state", "zipCode")
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
          )
          UPDATE customers SET "addressId" = (SELECT id FROM newAddress)
          WHERE id = $6;
          `;
        const valuesInsert = [
          address, address2, city, state, zipCode, customerId,
        ];
        // console.log(queryInsert, valuesInsert);
        return psqlPool.query(queryInsert, valuesInsert)
          .then((res) => res.rowCount)
          .catch((err) => console.log('ERROR INSERTING A NEW ADDRESS', err));
      }
      // else there is an existing address that needs to be updated
      const queryUpdate = `WITH foundAddress AS (
          SELECT "addressId" AS id
          FROM customers
          WHERE id = $1
          )
          UPDATE addresses SET 
            "address" = $2, 
            "address2" = $3,
            "city" = $4,
            "state" = $5,
            "zipCode" = $6
          WHERE id = (SELECT id FROM foundAddress)
          RETURNING *;
          `;
      const valuesUpdate = [
        customerId, address, address2, city, state, zipCode,
      ];
      // console.log(queryUpdate, valuesUpdate);
      return psqlPool.query(queryUpdate, valuesUpdate)
        .then((res) => res.rowCount)
        .catch((err) => console.log('ERROR updating customer address', err));
    },

    // ! DEPRECATED, but kept for reference
    updateAddress: (parent, args, { psqlPool }) => {
      // DEPRECATED FOR createOrUpdateAddress
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
    }, // ! DEPRECATED
  },
};
