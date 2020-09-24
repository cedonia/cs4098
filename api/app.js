const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

// app.get('/hello', async (req, res) => {
//     res.status(200).send('Hello World!');
// });

app.get('/Hello', async (req, res) => {
  res.send('Hello World!')
})

const server = app.listen(port, hostname, () => console.log(`App listening at http://localhost:${port}`));

module.exports = server;