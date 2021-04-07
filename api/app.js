const express = require('express');
const app = express();
const mysql = require('mysql');
const fs = require('fs');
const axios = require('axios');
const hostname = '127.0.0.1';
const port = 21257;
var cors = require('cors');
let parser = require('xml2js');
const { uuid } = require('uuidv4');
const rss = require('rss');
const FileGenerator = require('./FileGenerator');
const database = require('./database.js');

const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

//Apply headers
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

//Sample: https://cmp24.host.cs.st-andrews.ac.uk/api/GenPodcast/title/autumn?mon=false&tues=false&wed=false&thurs=false&fri=false&sat=false&sun=true
app.get('/api/GenPodcast/title/:title', async (req, res) => {

	//Generate new id and edit code, record current date and time
	const librilisten_id = uuid();
	const secret_edit_code = uuid();
	const currentDateTime = calcCurrentTimeString();

	//Generate the formatted title
	var formattedTitle = req.params.title;
	if(formattedTitle.startsWith("The")) {
		//Drop "the" if it's at the start of the title
		formattedTitle = formattedTitle.slice(6);
	}	

	//Retrieve the rss url from Librivox
	const queryRes = await axios.get('https://librivox.org/api/feed/audiobooks?title=' + formattedTitle + '&&fields={url_rss,num_sections}')
	.catch((err) => {
		console.log(err);
		res.status(200).json({
			secret_edit_link: "dummy",
			url_rss: "dummy"
		});
	});

	const url_rss = queryRes.data.books[0].url_rss;

	//Develop necessary queries
	const bookQuery = 'INSERT INTO librivox_books VALUES (\'' + 
		url_rss + '\', \'' + 
		req.params.title + 
		'\', null);';

	const podcastQuery = 'INSERT INTO librilisten_podcasts VALUES (\'' + 
		librilisten_id + '\', \'' + 
		url_rss + '\', \'' + 
		secret_edit_code + '\', ' + 
		req.query.mon + ', ' + 
		req.query.tues + ', ' + 
		req.query.wed + ', ' + 
		req.query.thurs + ', ' + 
		req.query.fri + ', ' + 
		req.query.sat + ', ' + 
		req.query.sun + 
		', false, 0);';

	var chaptersQuery = 'INSERT INTO librilisten_chapters VALUES (\'' + 
		librilisten_id + 
		'\', 0, null)';

	//Add additional entries for each chapter
	for(var i = 1; i < queryRes.data.books[0].num_sections; i++) {
		chaptersQuery = chaptersQuery + ', (\'' + librilisten_id + '\', ' + i + ', null)';
	}
	chaptersQuery = chaptersQuery + ';';

	try {
		await database.executeQuery(bookQuery);
	}
	catch(err) {
		console.log("This book is already in the database.")
	}
	
	await database.executeQuery(podcastQuery);
	await database.executeQuery(chaptersQuery);

	await FileGenerator.genUpdatedFile(currentDateTime, url_rss, librilisten_id);

	res.status(200).json({
		secret_edit_link: secret_edit_code,
		url_rss: librilisten_id
	});
});

app.get('/api/update', async (req, res) => {

	var d = new Date();

	//Update all podcasts which need to be updated
	var currentDateTime = calcCurrentTimeString();
	var query = "SELECT Librivox_rss_url, Librilisten_podcast_id FROM librilisten_podcasts WHERE is_done = false AND skip_next = 0 AND " + currentDay.toLowerCase() + " = true";

	const connection = database.makeConnection();
	connection.connect();

	await connection.query(query, function(err, rows, fields) {
		if (err) throw err;

		for(var row of rows) {
			FileGenerator.genUpdatedFile(currentDateTime, row.Librivox_rss_url, row.Librilisten_podcast_id);
		}
	});

	//Increment skipped podcasts
	var currentDay = days[d.getUTCDay()];
	query = "SELECT Librilisten_podcast_id, skip_next FROM librilisten_podcasts WHERE skip_next > 0 AND " + currentDay.toLowerCase() + " = true;"

	await connection.query(query, function(err, rows, fields) {
		if(err) throw err;
		for(var row of rows) {
			database.executeQuery('UPDATE librilisten_podcasts SET skip_next = ' + row.skip_next - 1 + 
				"WHERE Librilisten_podcast_id = \'" + row.Librilisten_podcast_id + "\';", connection);
		}
	});

	connection.end();

	res.status(200); //todo is this right? 

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

const server = app.listen(port, hostname, () => console.log(`App listening at http://${hostname}:${port}`));

module.exports = server;
