const { makeExecutableSchema } = require('graphql-tools');
const Base = require('./baseSchema');
const Address = require('./address/addressSchema');
const Customer = require('./customer/customerSchema');

const resolvers = require('./resolvers');

module.exports = makeExecutableSchema({
  typeDefs: [...Base(), ...Address(), ...Customer()],
  resolvers,
});
