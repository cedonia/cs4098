const mysql = require('mysql');


/***
Generate the rss file: Take the current date and time and the original rss url 
and generate the initial file with just one chapter.
**/
module.exports.makeConnection = async function () {
	return mysql.createConnection({
			host     : process.env.host,
			database : process.env.database,
			port     : process.env.port,
			user     : process.env.user,
			password : process.env.password,
	});
};

module.exports.executeQuery = async function(query, connection) {
	connection.query(query, function(err, rows, fields) {
		if(err) throw err;
	});
}

module.exports.executeQuery = async function(query) {
	connection = await module.exports.makeConnection();
	connection.query(query, function(err, rows, fields) {
		if(err) throw err;
	});
	connection.end();
}

module.exports.executeQueryWithErrorMsg = async function(query, connection, errorMsg) {
	connection.query(query, function(err, rows, fields) {
		if(err) console.log(errorMsg);
	});
}