const { graphql } = require('graphql');
const schema = require('../server/schema');

const testApi = {
  graphql: async (req, res) => {
    try {
      const result = await graphql(schema, req.body.query, req);
      if (result.errors) throw (result.errors);
      return res.ok(result);
    } catch (err) {
      return res.badRequest(err);
    }
  },
};

module.exports = testApi;
