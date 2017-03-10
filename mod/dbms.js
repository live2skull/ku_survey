
var mysql = require('mysql');

exports.pool = mysql.createPool({
    host: '192.168.1.1',
    port: 3309,
    user: 'nomoreqq',
    password: 'nomoreqq1!',
    database: 'kuvey',
    connectionLimit: 100,
    waitForConnections: true,
    multipleStatements: true
});