const express = require('express');
const app = express();

const mysql = require('mysql');
const fs = require('fs');

const axios = require('axios');

const hostname = '127.0.0.1';
const port = 21257;

var cors = require('cors');

var database = require('./database.js');
let parser = require('xml2js');

const { uuid } = require('uuidv4');

const rss = require('rss');


app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, access-control-allow-origin");
	next();
});

app.get('/api', async(req, res) => {
	res.status(200).send("Welcome to the base page of the Librilisten API.");
});

//TODO: THIS MAYBE SHOULDN'T BE A GET COMMAND
app.get('/api/GenPodcast/title/:title', async (req, res) => {
	console.log(req.params.title);

	if(req.params.title.startsWith("The")) {
		req.params.title = req.params.title.slice(6);
	}

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
    	console.log(data);

    	genFile(librilisten_id, 1, data.url_rss);

    	storeDatabase(data, librilisten_id, secret_edit_code);

		res.status(200).json({
		secret_edit_link: secret_edit_code,
		url_rss: librilisten_id
	});
    })
    .catch((err) => {
    	console.log(err)// or have an explicit error class and assign its properties
    });
});

let genFile = (async (librilisten_id, next_chapter, url_rss) => {
	axios.get(url_rss).then(response => {
		const rss_feed = response.data;

		parser.parseString(rss_feed, function (err, result) {
			const chapters = result.rss.channel[0].item;
			chapters.splice(next_chapter);

			var builder = new parser.Builder();
			var xml = builder.buildObject(result);

			fs.writeFile('../../../nginx_default/podcasts/' + librilisten_id + '.rss', xml, function (err) {
				if (err) return console.log(err);
			});
		});
				//TODO: defensive programming for file name
				//TODO: increment the next_chapter value
				//TODO: simplify the database
	});

});

let storeDatabase = (async (data, librilisten_id, secret_edit_code) => {
	var connection = mysql.createConnection({
			host     : process.env.host, //localhost
			database : process.env.database, //librilisten
			port     : process.env.port, //3306
			user     : process.env.user, //cedonia
			password : process.env.password,
		});
		connection.connect();

		//Add the book to the database
		connection.query("INSERT INTO librivox_books VALUES ("+ data.id + ", \'" + data.title + "\', \'" + data.authors[0].last_name + "\', \'" + data.url_rss + "\', " + data.num_sections + ")", function(err, rows, fields) {
			if (err) throw err;
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
		connection.query("INSERT INTO librilisten_podcasts VALUES (\'"+ librilisten_id + "\', " + data.id + ", \'" + secret_edit_code + "\', true, false, false, false, false, false, false, false, 1, 0)", function(err, rows, fields) {
			if (err) throw err;
			// console.log(rows);
		});

		connection.end();
})

// app.get('/api/podcast/:id', async (req, res) => {
	
// });

//TODO IS THIS A GET?
app.get('/api/edit/:secret', async (req, res) => {
	//TODO MAKE SURE THIS CAN'T BE ACCESSED WHEN IT SHOULDN'T BE
});

app.get('/api/update', async (req, res) => {

});

const server = app.listen(port, hostname, () => console.log(`App listening at http://${hostname}:${port}`));

module.exports = server;
