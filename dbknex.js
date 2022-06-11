const config = require('config');
const trace = require('./trace');

const knex = require('knex')({
  client: 'mysql',
  connection: config.get('db'),
});

knex.on('query', function (debugData) {
  trace.output(debugData);
});

module.exports = knex;
