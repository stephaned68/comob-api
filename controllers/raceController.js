/**
 * Races data methods
 */

const knex = require('../core/dbknex');
const { errorNotFound } = require('../core/errors');
const { dsExists, stringOrDefault, Ok } = require('../core/lib');
const trace = require('../core/trace');

const raceQueries = require('../queries/raceQueries');

const getByType = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  const typeList = stringOrDefault(req.query.types);

  const sql = raceQueries.getByType(knex, dbid, typeList);
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
      if (error) throw { message: error.message };
    });
};

const getOne = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  const race = stringOrDefault(req.params.race);
  if (race === '') throw { status:400, message:'Required URL argument not found' };

  const sql = raceQueries.getOne(knex, dbid, race);
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
  getByType,
  getOne
};