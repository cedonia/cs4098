var mysql = require('mysql');

class database {
	

}

module.exports.connect = function connect() {
	console.log("MADE IT INTO CONNECTION");
		var connection = mysql.createConnection({
			host     : 'localhost',
			database : 'librilisten',
			port     : '3306',
			user     : 'cedonia',
			password : process.env.password,
		});
		connection.connect();
		connection.query('SELECT * FROM librivox_books', function(err, rows, fields) {
			if (err) throw err;
			console.log(rows);
		});
		connection.end();
	};