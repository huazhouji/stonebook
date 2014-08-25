var config = require('../config');
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: config.dbhost,
    user: config.dbuser,
    database: config.db,
    password: config.dbpwd
});

pool.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows[0].solution);
});

require('./topic');