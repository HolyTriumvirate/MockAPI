const express = require('express');
const graphQLHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

const PORT = 3000;
const app = express();

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// import the pool connection
const psqlPool = require('../database/dbConnection');

// flow test if needed
// app.use(express.json()); // parse req.body to json
// app.use((req, res, next) => {
//   console.log(`METHOD: ${req.method}, \nURL: ${req.url}, \nBODY: ${JSON.stringify(req.body)}\n`);
//   return next();
// });

// massively helpful resource: https://marmelab.com/blog/2017/09/06/dive-into-graphql-part-iii-building-a-graphql-server-with-nodejs.html
// makeExe.Sch. is used to combine the typeDef and resolvers. this allows us to
// define type resolvers which are essential to relational data in my opinion...
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use('/graphql',
  graphQLHTTP({
    schema,
    graphiql: true,
    // refactor here to include the database connections on the context property. I think that's
    // best practice to pass & control d-base connections and current user sessions
    context: { psqlPool },
  }));

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

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
