/**
 * Abilities data methods
 */

const knex = require('../core/dbknex');
const { errorNotFound } = require('../core/errors');
const { dsExists, stringOrDefault, Ok } = require('../core/lib');
const trace = require('../core/trace');

const abilityQueries = require('../queries/abilityQueries');

const getFilteredAbilities = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  let type = stringOrDefault(req.query.type);
  let profile = stringOrDefault(req.query.profile);
  let race = stringOrDefault(req.query.race);

  if (type !== '' && profile !== '' && race !== '') {
    throw { status:400, message:'Only one URL argument can be passed' };
  }
  if (type === '' && profile === '' && race === '') {
    throw { status:400, message:'Required URL argument not found' };
  }

  let sql = '';
  if (type !== '') sql = abilityQueries.getByType(dbid, type);
  if (profile !== '') sql = abilityQueries.getByProfile(dbid, profile);
  if (race !== '') sql = abilityQueries.getByRace(dbid, race);

  trace.output(sql);

  knex
    .raw(sql)
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

const getByPath = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }
  const path = decodeURI(req.params.path);

  const sql = abilityQueries.getByPath(dbid);
  trace.output(sql);

  knex
    .raw(sql, [path])
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
  getFilteredAbilities,
  getByPath
}