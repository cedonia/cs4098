const mysql = require('mysql');


/***
Generate the rss file: Take the current date and time and the original rss url 
and generate the initial file with just one chapter.
**/
module.exports.makeConnection = async function () {
	return mysql.createConnection({
			host     : process.env.host, //localhost
			database : process.env.database, //librilisten
			port     : process.env.port, //3306
			user     : process.env.user, //cedonia
			password : process.env.password,
	});
};

module.exports.executeQuery = async function(query, connection) {
	connection.query(query, function(err, rows, fields) {
		if(err) throw err;
	});
}

module.exports.executeQuery = async function(query) {
	connection = module.exports.makeConnection();
	connection.query(query, function(err, rows, fields) {
		if(err) throw err;
	});
	connection.end();
}