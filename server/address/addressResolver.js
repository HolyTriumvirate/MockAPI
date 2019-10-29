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
