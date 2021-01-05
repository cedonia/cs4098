const express = require('express');
const app = express();

const mysql = require('mysql');
const fs = require('fs');

const axios = require('axios');

const hostname = 'localhost';
const port = 21267;

var cors = require('cors');

var database = require('./database.js');
let parser = require('xml2js');

const { uuid } = require('uuidv4');

// app.use(express.static('../podcasts'));


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

//TODO: THIS MAYBE SHOULDN'T BE A GET COMMAND
app.get('/GenPodcast/title/:title', async (req, res) => {
	console.log(req.params.title);

	let librilisten_id = uuid();
	let secret_edit_code = uuid();

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
    	// console.log(data);

    	storeDatabase(data, librilisten_id, secret_edit_code);

		res.status(200).json({
		secret_edit_link: 'http://localhost:21267/edit/' + secret_edit_code,
		url_rss: 'http://localhost:21267/podcast/' + librilisten_id //TODO: this will be a librilisten link
	});
    })
    .catch((err) => {
    	console.log(err)// or have an explicit error class and assign its properties
    });
});

let storeDatabase = (async (data, librilisten_id, secret_edit_code) => {
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
		await axios.get(data.url_rss).then(response2 => {
			const rss_feed = response2.data;
			const xml = parser.parseString(rss_feed, function (err, result) {
				const chapters = result.rss.channel[0].item;
				var currentChapter = 0;

				for(let chapter of chapters) {
					connection.query("INSERT INTO librivox_chapters VALUES (" + data.id + ", " + currentChapter + ", \'" + chapter.enclosure[0].$.url + "\')", function(err, rows, fields) {
						if (err) throw err;
					});
					currentChapter ++;
				}

			});
		});

		//Store ref to a new podcast the librilisten_podcasts table
		connection.query("INSERT INTO librilisten_podcasts VALUES (\'"+ librilisten_id + "\', " + data.id + ", \'" + secret_edit_code + "\', true, false, false, false, false, false, false, false, 0, 0)", function(err, rows, fields) {
			if (err) throw err;
			console.log(rows);
		});

		connection.end();
})

app.get('/podcast/:id', async (req, res) => {
	//TODO: if the file doesn't exist, generate the initial RSS file and store it in the file system

	try {
		if(fs.existsSync('../podcasts/' + req.params.id + '.rss')) {
			//File exists
			res.sendFile(req.params.id + '.rss', {root: '../podcasts'});
		}
		else {
			res.status(200).send("FILE DOES NOT EXIST");
		}
	}
	catch(err) {
		console.error(err);
	}
});

//TODO IS THIS A GET?
app.get('/edit/:secret', async (req, res) => {
	//TODO MAKE SURE THIS CAN'T BE ACCESSED WHEN IT SHOULDN'T BE
});

const server = app.listen(port, hostname, () => console.log(`App listening at http://${hostname}:${port}`));

module.exports = server;
