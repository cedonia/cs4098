const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 21257;

app.get('/nano', async(req, res) => {
	res.status(200).send('Welcome to this app');
});

app.get('/', async(req, res) => {
	res.status(200).send("Welcome to the base page of the app");
});

app.get('/hello', async (req, res) => {
    res.status(200).send('Hello World!');
});

const server = app.listen(port, hostname, () => console.log(`App listening at http://${hostname}:${port}`));

module.exports = server;
