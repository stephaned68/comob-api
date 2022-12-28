const trace = require("./trace");

const db = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const knex = require("knex")({
  client: "mysql",
  connection: db,
});

knex.raw("set names utf8;");
knex.raw("set global group_concat_max_len = 10000000;");

knex.on("query", function (debugData) {
  trace.output(debugData);
});

module.exports = knex;
