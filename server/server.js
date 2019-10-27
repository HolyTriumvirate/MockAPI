const express = require('express');
const graphQLHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

const PORT = 3000;
const app = express();

const typeDefs = require('./schema');
const resolvers = require('./root');

// // for flow test
// app.use(express.json());

// // flow test things
// app.use((req, res, next) => {
//   console.log(`METHOD: ${req.method}, \nURL: ${req.url}, \nBODY: ${JSON.stringify(req.body)}\n`);
//   return next();
// });

// massively helpful resource: https://marmelab.com/blog/2017/09/06/dive-into-graphql-part-iii-building-a-graphql-server-with-nodejs.html
// used to
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use('/graphql',
  graphQLHTTP({
    schema,
    graphiql: true,
  }));

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
