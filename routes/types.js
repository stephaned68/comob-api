/**
 * Types routes
 */

const express = require('express');
const router = express.Router();

const knex = require('../dbknex');

const { dsExists, getDataset } = require('../lib');

const trace = require('../trace');

/**
 * Route : /paths/{:dataset}
 * Return the list of special path types
 */
router.get(['/paths/:ds', '/abilities/:ds', '/races/:ds'], (req, res, next) => {
  const dbid = req.params.ds;
  if (!dsExists(dbid)) {
    throw 'Unknown dataset';
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
        res.sendStatus(404);
      } else {
        result = result.filter((p) => {
          if ((dataset.hidePaths || []).length === 0) return true;
          return (
            dataset.hidePaths.findIndex((path) => p.type_voie === path) === -1
          );
        });
        res.status(200).json({
          rs: result,
        });
      }
    })
    .catch(function (error) {
      if (error) throw error;
    });
});

module.exports = router;
