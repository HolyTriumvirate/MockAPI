const express = require('express');
const graphQLHTTP = require('express-graphql');

const PORT = 3000;
const app = express();

const schema = require('./schema');
const rootValue = require('./root');

// for flow test
// app.use(express.json());

// flow test things
// app.use((req, res, next) => {
//   console.log(`METHOD: ${req.method}, \nURL: ${req.url}, \nBODY: ${JSON.stringify(req.body)}\n`);
//   return next();
// });

app.use('/graphql',
  graphQLHTTP({
    schema,
    rootValue,
    graphiql: true,
  }));

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
