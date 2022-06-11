const mysql = require('mysql');
const config = require('config');

const connection = mysql.createConnection(config.get('db'));

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
