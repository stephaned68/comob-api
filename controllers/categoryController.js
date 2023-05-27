/**
 * Categories data methods
 */

const knex = require('../core/dbknex');
const { errorNotFound } = require('../core/errors');
const { dsExists, stringOrDefault, Ok } = require('../core/lib');
const trace = require('../core/trace');

const categoryQueries = require('../queries/categoryQueries');

const getAllCategories = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  const sql = categoryQueries.getAllCategories(knex, dbid);
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

const getByParent = (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  const parent = stringOrDefault(req.params.parent);

  const sql = categoryQueries.getByParent(knex, dbid, parent);
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
  getAllCategories,
  getByParent
};