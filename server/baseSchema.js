// setup a base schema that will be combined with the others

// by deprecating the dummy Query and mutation, they're basically hidden in
// the GraphiQL documentation which is nice
const Base = `
directive @deprecated(
  reason: String = "No longer supported"
) on FIELD_DEFINITION | ENUM_VALUE

type Query {
  dummy: Boolean @deprecated (reason: "dummy query does nothing")
}

type Mutation {
  dummy: Boolean @deprecated (reason: "does nothing")
}
`;

module.exports = () => [Base];
