const root = {};
const Pool = require('../database/dbConnection');

// GRAPHQL plays nice with promises, so returning a promise handles asyncronicity
root.address = (args) => Pool.query('SELECT * FROM addresses WHERE id = $1', [args.id])
  .then((data) => data.rows[0]);

// returns all addresses
root.addresses = () => Pool.query('SELECT * FROM addresses')
  .then((data) => data.rows);

module.exports = root;
