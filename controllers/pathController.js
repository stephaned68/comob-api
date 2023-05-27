/**
 * Paths data methods
 */

const knex = require('../core/dbknex');
const { errorNotFound } = require('../core/errors');
const { dsExists, stringOrDefault, Ok } = require('../core/lib');
const trace = require('../core/trace');
const pathQueries = require('../queries/pathQueries');

const getByType = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  let type = stringOrDefault(req.query.type);

  if (type === '') throw { status:400, message:'Required URL argument not found' };
  
  const sql = pathQueries.getByType(dbid, type);
  
  trace.output(sql);

  knex
    .raw(sql, [type])
    .then(function (result) {
      result = result[0];
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

const getByProfile = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message: 'Not Found' };
  }

  const profile = decodeURI(req.params.profile);

  const abilitiesFlg = Object.keys(req.query).indexOf('abilities') != -1;

  const sql = pathQueries.getByProfile(dbid, abilitiesFlg);
  trace.output(sql);
  
  knex
    .raw(sql, [profile])
    .then(function (result) {
      result = result[0];
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
  getByProfile
}