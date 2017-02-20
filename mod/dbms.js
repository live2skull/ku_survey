
var mysql = require('mysql');

exports.pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'nomoreqq',
    password: 'nomoreqq1!',
    database: 'kuvey',
    connectionLimit: 100,
    waitForConnections: true,
    multipleStatements: true
});