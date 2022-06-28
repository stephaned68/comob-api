const trace = require('./trace');

const db = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const knex = require('knex')({
  client: 'mysql',
  connection: db,
});

knex.raw('set names utf8;');

knex.on('query', function (debugData) {
  trace.output(debugData);
});

module.exports = knex;
