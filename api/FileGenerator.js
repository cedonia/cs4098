const axios = require('axios');
const parser = require('xml2js');
const fs = require('fs');
const database = require('./database.js');

const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

/***
Generate the rss file: Take the current date and time and the original rss url 
and generate the initial file with just one chapter.
**/
module.exports.genUpdatedFile = async function (dateTime, url_rss, librilisten_id, ignorePubDayDup) {

	//Open a connection to the database
	var connection = await database.makeConnection();
	connection.connect();

	//Calculate an array of the published chapters (including the one published today)
	retrieveAndUpdatePublishedChapters(connection, librilisten_id, dateTime, ignorePubDayDup, function(chapterPubDates) {

		console.log("CHAPTER PUB DATES: " + chapterPubDates);
		//Return if it doesn't need to update the file
		if(chapterPubDates === null) return;

		//Generate the actual file
		doTheFileGeneration(url_rss, librilisten_id, chapterPubDates).then(connection.end());
	});

};

//Calculate all the published chapters so far
const retrieveAndUpdatePublishedChapters = (async (connection, librilisten_id, dateTime, ignorePubDayDup, callback) => {
	var query = "SELECT Chapter_num, Pub_date FROM librilisten_chapters " 
			+ "WHERE Librilisten_podcast_id = \'" + librilisten_id + "\' AND Pub_date IS NOT NULL;";

	var chapterPubDates = [];

	await connection.query(query, async function(err, rows, fields) {
		if(err) throw err;

		for(var row of rows) {
			chapterPubDates[row.Chapter_num] = row.Pub_date;
		}

		//Check that this podcast hasn't already been updated today (if not ignoring that)
		if(!ignorePubDayDup && chapterPubDates.length > 0) {
			var last = chapterPubDates[chapterPubDates.length - 1];
			const ts = new Date();
			last = last.split(' ');

			if(last[0] + " " + last[1] === days[ts.getUTCDay()] + ', ' + ts.getUTCDate() 
				&& last[2] === months[ts.getUTCMonth()]) return null; //Return null to indicate that the file isn't in need up regeneration
		}

		chapterPubDates[chapterPubDates.length] = dateTime; //Add today's chapter 

		//Update chapters database
		query = "UPDATE librilisten_chapters SET Pub_date=\'" + dateTime + 
			"\' WHERE Librilisten_podcast_id=\'" + librilisten_id + 
			"\' AND Chapter_num=" + (chapterPubDates.length - 1) + ";";
		database.executeQuery(query, connection);

		return callback(chapterPubDates);
	});	
});

//Do the actual generation of the file
const doTheFileGeneration = (async (url_rss, librilisten_id, chapterPubDates) => {

	//Retrieve the original Librivox rss file
	axios.get(url_rss)
	.then(response => {

		const rss_feed = response.data; //The librivox rss feed

		parser.parseString(rss_feed, function(err, result) {

			const chapters = result.rss.channel[0].item;

			if(chapters.length == chapterPubDates.length) {
				//All chapters have now been published!
				query = "UPDATE librilisten_podcasts SET is_done = true WHERE Librilisten_podcast_id=\'" + librilisten_id + "\';";
				database.executeQuery(query, connection);
			}

			//Chop the chapters down to just the ones with pub dates
			chapters.splice(chapterPubDates.length);

			//Loop through pub dates, giving each published chapter its pub date
			for(var i = 0; i < chapterPubDates.length; i++) {
				result.rss.channel[0].item[i].pubDate = chapterPubDates[i];
			}

			//Construct the new file
			var builder = new parser.Builder();
			var xml = builder.buildObject(result);
			fs.writeFile('../../../nginx_default/podcasts/' + librilisten_id + '.rss', xml, function (err) {
				if (err) return console.log(err);
			});
		});
	});
});