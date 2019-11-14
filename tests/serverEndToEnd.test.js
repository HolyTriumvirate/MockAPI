const { graphql } = require('graphql');
const schema = require('../server/schema');

describe('testing the entire server without a database connection', () => {
  it('expect one to equal one', () => {
    const querySub = (q) => {
      switch (q) {
        case 'one':
          it('sohuld be equal 1', () => expect(1).toEqual(1));
          break;
        default:
          it('sohuld be equal 2', () => expect(2).toEqual(2));
          break;
      }
      return null;
    };
  });
});
