const mysql = require('mysql');

const dbConfig = require('./dbconfig.json');

module.exports = {
  
  getConn: function(dbid) {
    return mysql.createConnection(dbConfig[dbid]);
  },

  getPool: function(dbid) {
    return mysql.createPool({
      connectionLimit: 10,
      ...dbConfig[dbid]
    });
  },

};