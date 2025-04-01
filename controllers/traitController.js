/**
 * Traits data methods
 */

const knex = require('../core/dbknex');
const { errorNotFound } = require('../core/errors');
const { dsExists, strval, Ok } = require('../core/lib');
const trace = require('../core/trace');

const traitQueries = require('../queries/traitQueries');

const getByType = (req, res, next) => {
  const dbid = strval(req.params.ds);
  if (!dsExists(dbid))
    throw { status:404, message:'Unknown dataset' };

  const { race = '', profile = '' } = req.query;
  
  if (race === '' && profile === '')
    throw { status:400, message:'Required URL argument not found' };
  if (race !== '' && profile !== '')
    throw { status:400, message:'Too many URL arguments passed in' };

  let sql = '';
  if (race !== '')
    sql = traitQueries.getByRace(knex, dbid, race);
  if (profile !== '') 
    sql = traitQueries.getByProfile(knex, dbid, profile);
  trace.output(sql.toString());

  sql.then(function (result) {
    if (result.length == 0) {
      errorNotFound(res);
    } else {
      Ok(res, result);
    }
  }).catch(function (error) {
    if (error)
      throw { message: error.message };
  });
};

module.exports = {
  getByType
}