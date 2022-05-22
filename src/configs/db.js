const mysql = require('mysql2')
const config = require('./configs')
const pool = mysql.createPool(config.database.mysql)

pool.getConnection(function(err, connection) {
    // connected! (unless `err` is set)
    connection.release();
  });

module.exports = pool
