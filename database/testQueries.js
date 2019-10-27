// THIS IS A TEST FILE THAT I'M (alex) USING TO MAKE SURE PSQL IS SETUP CORRECTLY
const Pool = require('./dbConnection');

function tester(id) {
  Pool.query('SELECT * FROM addresses WHERE id = $1', [id])
    .then((data) => console.log(data));
}

console.log(tester(190));
