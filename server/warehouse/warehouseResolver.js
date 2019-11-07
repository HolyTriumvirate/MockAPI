module.exports = {
  Query: {
    warehouse: (parent, args, context) => {
      const query = 'SELECT * FROM warehouses WHERE warehouse_id = $1 LIMIT 1';
      const values = [args.warehouseId];
      return context.psqlPool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR LOOKING UP WAREHOUSE', err));
    },
  },
  Warehouse: {
    address: (parent, args, context) => {
      const query = 'SELECT * FROM addresses WHERE id=$1 LIMIT 1';
      const values = [parent.addressId];

      return context.psqlPool.connect()
        .then((client) => client.query(query, values)
          .then((data) => {
            client.release();
            return data.rows[0];
          })
          .catch((err) => {
            client.release();
            console.log('ERROR GETTING CUSTOMER\'S ADDRESS', err);
          }))
        .catch((err) => console.log('ERROR IN WAREHOUSE TYPE RESOLVER', err));
    },
  },
};
