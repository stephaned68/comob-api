const mysql = require('mysql');

const dbConfig = require('./dbconfig.json');

module.exports.getConn = function (dbid) {
  return mysql.createConnection({
    host: dbConfig[dbid].host,
    user: dbConfig[dbid].user,
    password: dbConfig[dbid].password,
    database: dbConfig[dbid].database
  });
}