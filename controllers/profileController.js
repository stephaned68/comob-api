/**
 * Profiles data methods
 */

const knex = require('../core/dbknex');
const { errorNotFound } = require('../core/errors');
const { dsExists, stringOrDefault, Ok } = require('../core/lib');
const trace = require('../core/trace');
const profileQueries = require('../queries/profileQueries');

const getFilteredProfiles = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Invalid dataset' };
  }

  const familyList = stringOrDefault(req.query.family);

  const type = stringOrDefault(req.query.type);

  const sql = profileQueries.getFiltered(dbid, familyList, type);
  trace.output(sql);

  knex
    .raw(sql)
    .then(function (result) {
      result = result[0];
      if (result.length == 0) {
        errorNotFound(res);
      } else {
        result.forEach((dataRow) => {
          dataRow.famille = JSON.parse(dataRow.famille);
        });
        Ok(res, result);
      }
    })
    .catch(function (error) {
      if (error) throw { message:error.message };
    });
}

module.exports = {
  getFilteredProfiles
};