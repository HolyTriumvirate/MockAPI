const express = require('express');
const graphQLHTTP = require('express-graphql');

const app = express();
const PORT = 3000;

// import in the combined schema from schema.js
const schema = require('./schema');

// import the pool connection to pass into context
const psqlPool = require('../database/psql/dbConnection');

// import the mongo Models (they are on the export of dbConnection)
const mongoConnectionAndModels = require('../database/mongo/dbConnection');

// flow test (if needed)
// app.use(express.json()); // parse req.body to json
// app.use((req, res, next) => {
//   console.log(`METHOD: ${req.method}, \nURL: ${req.url}, \nBODY: ${JSON.stringify(req.body)}\n`);
//   return next();
// });

// massively helpful resource: https://marmelab.com/blog/2017/09/06/dive-into-graphql-part-iii-building-a-graphql-server-with-nodejs.html
// makeExe.Sch. is used to combine the typeDef and resolvers. this allows us to
// define type resolvers which are essential to relational data in my opinion...
// const schema = makeExecutableSchema({ typeDefs, resolvers });
const startServer = async () => {
  // this is asyncronous, so use await to avoid sending an unresolved promise to context in app.use
  const mongo = await mongoConnectionAndModels();
  // console.log(mongo); // contains { CartModel: Model { Cart } }

  // setup the single graphql endpoint
  app.use('/graphql',
    graphQLHTTP({
      schema,
      graphiql: true,
      // best practice is to pass & control d-base connections and current user sessions via context
      context: { psqlPool, mongo },
    }));

  app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
};

// run the async function defined above to connect to mongo and run the server
startServer();

/*
  * EXAMPLE QUERY FROM THE FRONT END (FETCH)
  fetch('/graphql', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ query: '{ addresses { address address2 city state zipCode } }'})
  })
  .then(res => res.json())
  .then(data => console.log(data))
  */
