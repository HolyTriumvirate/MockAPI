const root = {};
const Pool = require('../database/dbConnection');

// GRAPHQL plays nice with promises, so returning a promise handles asyncronicity
root.address = (args) => {
  const query = 'SELECT * FROM addresses WHERE id = $1';
  const values = [args.id];
  return Pool.query(query, values)
    .then((data) => data.rows[0]);
};
// returns all addresses
root.addresses = () => {
  const query = 'SELECT * FROM addresses';
  return Pool.query(query)
    .then((data) => data.rows)
    .catch((err) => console.log('ERROR LOOKING UP ADDRESSES', err));
};

root.customer = (args) => {
  const query = 'SELECT * FROM customers WHERE id = $1';
  const values = [args.id];
  return Pool.query(query, values)
    .then((data) => {
      // this is a kind of janky work around to get the address for this user
      const address = root.address({ id: data.rows[0].addressId });
      // then spread the data row out into a new object with the address
      return { ...data.rows[0], address };
    })
    .catch((err) => console.log('ERROR LOOKING UP CUSTOMER', err));
};

// getting nested data (addresses of customers) is a little tricky...
root.customers = () => {
  const query = 'SELECT * FROM customers';
  return Pool.query(query)
    .then((data) => data.rows) // this will not return addresses of each customer
    .catch((err) => console.log('ERROR LOOKING UP CUSTOMERS', err));
};

module.exports = root;
