const express = require('express');
const app = express();

const hostname = 'localhost';
const port = 21257;

var cors = require('cors');

// app.use(cors);

app.use((req, res, next) => {
	// res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, access-control-allow-origin");
	next();
});

app.get('/node', async(req, res) => {
	res.status(200).send('Welcome to this app');
});

app.get('/', async(req, res) => {
	res.status(200).send("Welcome to the base page of the app");
});

app.get('/hello', async (req, res) => {
    res.status(200).send('Hello World!');
});

app.get('/GenPodcast', async (req, res) => {
	res.status(200).json({
		id: 11111
	});
});

app.get('/secretEditCode', async (req, res) => {
	res.status(200).json({
		secretEditCode: 22222
	});
});

const server = app.listen(port, hostname, () => console.log(`App listening at http://${hostname}:${port}`));

module.exports = server;
