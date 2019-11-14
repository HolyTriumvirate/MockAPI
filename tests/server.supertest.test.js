const request = require('supertest')('http://localhost:3000/');

describe('testing the entire server without a database connection', () => {
  it('returns all customers firstNames', async () => {
    await request.post('/graphql').send({ query: '{ customers { firstName } }' });
    // req.expect(200);
    // req.expect((res) => {
    //   expect(res.body).toBeInstanceOf(Array);
    // });
  });
});
// describe('testing the entire server without a database connection', () => {
//   it('expect one to equal one', () => {
//     const querySub = (q) => {
//       switch (q) {
//         case 'one':
//           it('sohuld be equal 1', () => expect(1).toEqual(1));
//           break;
//         default:
//           it('sohuld be equal 2', () => expect(2).toEqual(2));
//           break;
//       }
//       return null;
//     };
//   });
// });
