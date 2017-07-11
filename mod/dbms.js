
var mysql = require('mysql');

exports.pool = mysql.createPool({
    host: process.env.db_host,
    port: process.env.db_port,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
    connectionLimit: 100,
    waitForConnections: true,
    multipleStatements: true
});