/**
 * Types routes
 */

const express = require('express');
const router = express.Router();

const knex = require('../core/dbknex');
const { errorNotFound } = require('../core/errors');
const { dsExists, getDataset, stringOrDefault, Ok } = require('../core/lib');
const trace = require('../core/trace');

/**
 * Route : /paths/{:dataset}
 * Return the list of special path types
 */
router.get(['/paths/:ds', '/abilities/:ds', '/races/:ds'], (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }
  const dataset = getDataset(dbid);

  const tables = {
    paths: `${dbid}_types_voie`,
    abilities: `${dbid}_types_capacite`,
    races: `${dbid}_types_races`,
  };
  let url = req.url.split('/');
  const table = tables[url[1]];

  const sql = `select * from ${table}`;

  trace.output(sql);

  knex
    .select()
    .from(`${table}`)
    .then(function (result) {
      if (result.length == 0) {
        errorNotFound(res);
      } else {
        result = result.filter((p) => {
          if ((dataset.hidePaths || []).length === 0) return true;
          return (
            dataset.hidePaths.findIndex((path) => p.type_voie === path) === -1
          );
        });
        Ok(res, result);
      }
    })
    .catch(function (error) {
      if (error) throw { message:error.message };
    });
});

module.exports = router;
