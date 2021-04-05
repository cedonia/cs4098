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

const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];


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
//Sample: https://cmp24.host.cs.st-andrews.ac.uk/api/GenPodcast/title/autumn?mon=false&tues=false&wed=false&thurs=false&fri=false&sat=false&sun=true
app.get('/api/GenPodcast/title/:title', async (req, res) => {

	const formattedTitle = req.params.title;

    //Drop "the" if it's at the start of the title
	if(formattedTitle.startsWith("The")) {
		formattedTitle = formattedTitle.slice(6);
	}

	//Generate new id and edit code
	let librilisten_id = uuid();
	let secret_edit_code = uuid();

	//Record current date and time
	const currentDateTime = calcCurrentTimeString();

	//Retrieve the rss url from Librivox and make the podcast database entry
	axios.get('https://librivox.org/api/feed/audiobooks?title=' + formattedTitle + '&&fields={url_rss,num_sections}')
	.then(response => {
		const url_rss = response.data.books[0].url_rss;

		//Develop necessary queries
		const book = 'INSERT INTO librivox_books VALUES (\'' + url_rss + '\', \'' + req.params.title + '\', null);';
		const podcast = 'INSERT INTO librilisten_podcasts VALUES (\'' + librilisten_id + '\', \'' + url_rss + '\', \'' + secret_edit_code + '\', ' + req.query.mon + ', ' + req.query.tues + ', ' + req.query.wed + ', ' + req.query.thurs + ', ' + req.query.fri + ', ' + req.query.sat + ', ' + req.query.sun + ', false, 0);';
		var chapters = 'INSERT INTO librilisten_chapters VALUES (\'' + librilisten_id + '\', 0, null)';

		//Add additional entries for each chapter
		for(var i = 1; i < response.data.books[0].num_sections; i++) {
			chapters = chapters + ', (\'' + librilisten_id + '\', ' + i + ', null)';
		}
		chapters = chapters + ';';

		//Make the queries to the database
		threeDatabaseQueries(book, podcast, chapters)
		.then((result) => {
			genUpdatedFile(currentDateTime, url_rss, librilisten_id);
			res.status(200).json({
				secret_edit_link: secret_edit_code,
				url_rss: librilisten_id
			});
		});

	})
	.catch((err) => {
		console.log(err);
		//DELETE THIS!!!!
		res.status(200).json({
			secret_edit_link: "sss",
			url_rss: "sss"
		});
	});

});

//TODO : RENAME THIS IS ONLY FOR THE INITIAL SETUP
let threeDatabaseQueries = (async (librivox_books_query, librilisten_podcasts_query, librilisten_chapters_query) => {
	var connection = mysql.createConnection({
			host     : process.env.host, //localhost
			database : process.env.database, //librilisten
			port     : process.env.port, //3306
			user     : process.env.user, //cedonia
			password : process.env.password,
		});
	connection.connect();


	connection.query(librivox_books_query, function(err, rows, fields) {
		if (err) console.log("This book is already in the database.");

		connection.query(librilisten_podcasts_query, function(err, rows, fields) {
			if(err) throw err;

			connection.query(librilisten_chapters_query, function(err, rows, fields) {
				if(err) throw err;
				connection.end();
			})
		});
	})

});

	/***

Generate the rss file: Take the current date and time and the original rss url and generate the initial file with just one chapter.

	**/
let genInitialFile = (async (dateTime, url_rss, librilisten_id) => {
	axios.get(url_rss)
	.then(response => {
		const rss_feed = response.data;

		parser.parseString(rss_feed, function (err, result) {
			const chapters = result.rss.channel[0].item;
			chapters.splice(1);

			result.rss.channel[0].item[0].pubDate = dateTime;

			var builder = new parser.Builder();
			var xml = builder.buildObject(result);

			fs.writeFile('../../../nginx_default/podcasts/' + librilisten_id + '.rss', xml, function (err) {
				if (err) return console.log(err);
			});
		});
	});
});

let genUpdatedFile = (async (dateTime, url_rss, librilisten_id) => {
	axios.get(url_rss)
	.then(response => {
		const rss_feed = response.data;

		console.log("PODCAST ID: " + librilisten_id);

		var query = "SELECT Chapter_num, Pub_date FROM librilisten_chapters WHERE Librilisten_podcast_id = \'" + librilisten_id + "\' AND Pub_date IS NOT NULL;";

		var connection = mysql.createConnection({
			host     : process.env.host, //localhost
			database : process.env.database, //librilisten
			port     : process.env.port, //3306
			user     : process.env.user, //cedonia
			password : process.env.password,
		});
		connection.connect();

		connection.query(query, function(err, rows, fields) {
			if (err) throw err;

			var chapterPubDates = [];

			for(var row of rows) {
				chapterPubDates[row.Chapter_num] = row.Pub_date;
			}

			//Check that this podcast hasn't already been updated today
			if(chapterPubDates.length > 0) {
				var last = chapterPubDates[chapterPubDates.length - 1];
				const ts = new Date();
				last = last.split(' ');
				if(last[0] + " " + last[1] === days[ts.getUTCDay()] + ', ' + ts.getUTCDate() && last[2] === months[ts.getUTCMonth()]) return;
			}


			chapterPubDates[chapterPubDates.length] = dateTime;

			query = "UPDATE librilisten_chapters SET Pub_date=\'" + dateTime + "\' WHERE Librilisten_podcast_id=\'" + librilisten_id + "\' AND Chapter_num=" + (chapterPubDates.length - 1) + ";";

			connection.query(query, function(err, rows, fields) {
				if(err) throw err;
			});

			parser.parseString(rss_feed, function(err, result) {
				const chapters = result.rss.channel[0].item;

				if(chapters.length == chapterPubDates.length) {
					//All chapters have now been published!
					query = "UPDATE librilisten_podcasts SET is_done = true WHERE Librilisten_podcast_id=\'" + librilisten_id + "\';";
					connection.query(query, function(err, rows, fields) {
						if(err) throw err;
					})
				}

				chapters.splice(chapterPubDates.length);

				for(var i = 0; i < chapterPubDates.length; i++) {
					result.rss.channel[0].item[i].pubDate = chapterPubDates[i];
				}

				var builder = new parser.Builder();
				var xml = builder.buildObject(result);

				fs.writeFile('../../../nginx_default/podcasts/' + librilisten_id + '.rss', xml, function (err) {
					if (err) return console.log(err);
				});
			});
			

			connection.end();
		});
	})
});

let calcCurrentTimeString = (() => {
	let ts = new Date();

	let dateTime = days[ts.getUTCDay()] + ', ' + ts.getUTCDate() + ' ' + months[ts.getUTCMonth()] + ' ' + ts.getUTCFullYear() + ' ' + makeNumTwoDigits(ts.getUTCHours()) + ':' + makeNumTwoDigits(ts.getUTCMinutes()) + ':' + makeNumTwoDigits(ts.getUTCSeconds()) + ' GMT';
	console.log(dateTime);
	return dateTime;
});

let makeNumTwoDigits = ((num) => {
	if(num >= 10) return num;

	return '0' + num;
});

app.get('/api/update', async (req, res) => {

	var d = new Date();

	var currentDay = days[d.getUTCDay()];
	var currentDateTime = calcCurrentTimeString();
	var query = "SELECT Librivox_rss_url, Librilisten_podcast_id FROM librilisten_podcasts WHERE is_done = false AND skip_next = 0 AND " + currentDay.toLowerCase() + " = true";

	var connection = mysql.createConnection({
			host     : process.env.host, //localhost
			database : process.env.database, //librilisten
			port     : process.env.port, //3306
			user     : process.env.user, //cedonia
			password : process.env.password,
		});
	connection.connect();


	connection.query(query, function(err, rows, fields) {
		if (err) throw err;

		for(var row of rows) {
			genUpdatedFile(currentDateTime, row.Librivox_rss_url, row.Librilisten_podcast_id);
		}

		connection.end();

	});

	//Increment skipped ones
	query = "SELECT Librilisten_podcast_id, skip_next FROM librilisten_podcasts WHERE skip_next > 0 AND " + currentDay.toLowerCase() + " = true;"

	connection.query(query, function(err, rows, fields) {
		if(err) throw err;
		for(var row of rows) {
			connection.query('UPDATE librilisten_podcasts SET skip_next = ' + row.skip_next - 1 + "WHERE Librilisten_podcast_id = \'" + row.Librilisten_podcast_id + "\';", function(err, rows, fields) {
				if(err) throw err;
			});
		}
	});

	res.status(200); //todo is this right? 

});

const server = app.listen(port, hostname, () => console.log(`App listening at http://${hostname}:${port}`));

module.exports = server;
