// setup a base schema that will be combined with the others

const Base = `
type Query {
  dummy: Boolean
}

type Mutation {
  dummy: Boolean
}
`;

module.exports = () => [Base];
