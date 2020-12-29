const express = require('express');
const app = express();

const mysql = require('mysql');
const fs = require('fs');

const axios = require('axios');

const hostname = 'localhost';
const port = 21267;

var cors = require('cors');

var database = require('./database.js');

// app.use(cors);

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, access-control-allow-origin");
	next();
});

app.get('/', async(req, res) => {
	res.status(200).send("Welcome to the base page of the Librilisten API.");
});

app.get('/GenPodcast/title/:title', async (req, res) => {
	console.log(req.params.title);

	axios.get('https://librivox.org/api/feed/audiobooks?title=' + req.params.title + '&&fields={id,title,url_rss,authors,num_sections}',
    {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/'
      }
    }
    )
    .then(response => {
    	const data = response.data.books[0]
    	console.log(data);

    	var connection = mysql.createConnection({
			host     : 'localhost',
			database : 'librilisten',
			port     : '3306',
			user     : 'cedonia',
			password : process.env.password,
		});
		connection.connect();

		//Add the book to the database
		connection.query("INSERT INTO librivox_books VALUES ("+ data.id + ", \'" + data.title + "\', \'" + data.authors[0].last_name + "\', \'" + data.url_rss + "\', " + data.num_sections + ")", function(err, rows, fields) {
			if (err) throw err;
			console.log(rows);
		});

		//Store the book's chapters in the database
		connection.query("INSERT INTO librivox_chapters VALUES (" + )


		connection.end();

		res.status(200).json({
		id: data.id,
		title: data.title,
		url_rss: data.url_rss
	});
    })
    .catch((err) => {
    	console.log(err)// or have an explicit error class and assign its properties
    });
});

app.get('/secretEditCode', async (req, res) => {
	res.status(200).json({
		secretEditCode: 22222
	});
});

const server = app.listen(port, hostname, () => console.log(`App listening at http://${hostname}:${port}`));

module.exports = server;
