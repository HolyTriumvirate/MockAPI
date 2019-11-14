/**
 * @module: orderResolver.js
 * @author: Austin Ruby
 * @description: define resolvers for order data
 */

module.exports = {
  Query: {
    order: (parent, args, context) => {
      const query = 'SELECT * FROM "customerOrders" WHERE "orderId" = $1';
      const values = [args.orderId];

      return context.psqlPool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR LOOKING UP ORDER', err));
    },
    customerOrders: (parent, args, context) => {
      const query = 'SELECT * FROM "customerOrders" WHERE "customerId" = $1';
      const values = [args.customerId];

      return context.psqlPool.query(query, values)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP ORDERS FOR ', err));
    },
  },
  Mutation: {
    addOrder: (parent, args, context) => {
      console.log('addOrder args are: ', args);
      // query to insert row in customerOrders table with customerId provided
      const customerOrderQuery = 'INSERT INTO "customerOrders" ("customerId") VALUES ($1) RETURNING *';
      // query to add row/s to orderProducts table based on productIds, productQtys provided
      // and orderId created by customerOrderQuery
      const orderProductQuery = 'INSERT INTO "orderProducts" ("productId", "productQty", "orderId") VALUES ($1, $2, $3) RETURNING *';
      // destructure customerId and products array from args
      const { customerId, products } = args;
      // connect to pool to run multiple concurrent queries
      return context.psqlPool.connect()
        // run initial customerOrderQuery to create customerOrder
        .then((client) => client.query(customerOrderQuery, [customerId])
          // once customerOrder created, use orderId to create orderProduct rows for each
          // product in products array
          .then((data) => {
            console.log('order created??? ', data.rows);
            const { orderId } = data.rows[0];
            return Promise.all(
              products.map((product) => {
                const { productId, productQty } = product;
                const values = [productId, productQty, orderId];
                // insert into orderProducts for each product
                return client.query(orderProductQuery, values)
                  .then((orderProductData) => {
                    console.log(orderProductData.rows);
                  })
                  .catch((err) => console.log(`ERROR CREATING ORDERPRODUCT FOR PRODUCT ID ${productId}: `, err));
              }),
            ).then(() => {
              client.release();
              return orderId;
            })
              .catch((err) => console.log('ERROR IN PROMISE ALL', err));
          })
          .catch((err) => console.log('ERROR CREATING CUSTOMER ORDER', err)))
        .catch((err) => console.log('ERROR CONNECTING WHILE ADDING ORDER', err));
    },
  },
  Order: {
    customer: (parent, args, context) => {
      const query = 'SELECT * FROM customers WHERE id = $1 LIMIT 1';
      const values = [parent.customerId];

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
      const values = [parent.orderId];

      return context.psqlPool.query(query, values)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP PRODUCTS FOR ORDER', err));
    },
  },
};
