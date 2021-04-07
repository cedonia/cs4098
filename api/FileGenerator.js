const axios = require('axios');
const mysql = require('mysql');
let parser = require('xml2js');


	/***

Generate the rss file: Take the current date and time and the original rss url and generate the initial file with just one chapter.

	**/

module.exports.genUpdatedFile = async function (dateTime, url_rss, librilisten_id) {
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
};