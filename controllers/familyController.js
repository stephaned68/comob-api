const knex = require('../core/dbknex');
const { errorNotFound } = require('../core/errors');
const { dsExists, stringOrDefault, Ok } = require('../core/lib');
const trace = require('../core/trace');

const getAllFamilies = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  const sql = knex.select().from(`${dbid}_familles`);
  trace.output(sql.toString());

  sql
    .then(function (result) {
      if (result.length == 0) {
        errorNotFound(res);
      } else {
        Ok(res, result);
      }
    })
    .catch(function (error) {
      if (error) throw { message:error.message };
    });
};

module.exports = {
  getAllFamilies
};