const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 21257;

app.get('/hello', async (req, res) => {
    res.status(200).send('Hello World!');
});

const server = app.listen(port, hostname, () => console.log(`App listening at http://${hostname}:${port}`));

module.exports = server;
