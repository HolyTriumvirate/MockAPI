const express = require('express');

const PORT = 3000;
const app = express();

app.use('/graphql');

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
