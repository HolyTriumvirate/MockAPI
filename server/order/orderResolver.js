module.exports = {
  Query: {
    order: (parent, args, context) => {
      const query = 'SELECT * FROM "customerOrders" WHERE "orderId" = $1';
      const values = [args.orderId];

      return context.psqlPool.query(query, values)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP ORDER', err));
    },
  },
  Order: {
    customer: (parent, args, context) => {
      const query = 'SELECT * FROM customers WHERE id = $1 LIMIT 1';
      const values = [parent[0].customerId];

      return context.psqlPool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR LOOKING UP CUSTOMER ON ORDER', err));
    },
    products: (parent, args, context) => {
      const query = `
      SELECT products."productId", products.name, products.description, products.price, products.weight, "orderProducts"."productQty"  FROM "customerOrders"
        JOIN "orderProducts" ON "customerOrders"."orderId" = "orderProducts"."orderId"
        JOIN products ON "orderProducts"."productId" = products."productId"
        WHERE "customerOrders"."orderId" = $1;
        `;
      const values = [parent[0].orderId];

      return context.psqlPool.query(query, values)
        .then((data) => {
          console.log(data.rows);
          return data.rows;
        })
        .catch((err) => console.log('ERROR LOOKING UP PRODUCTS FOR ORDER', err));
    },
  },
};
