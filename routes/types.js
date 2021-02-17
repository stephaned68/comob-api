/**
 * Types routes
 */

const express = require('express');
const router = express.Router();

const db = require('../dbconnect');

const { dsExists } = require('../lib');

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

  const tables = {
    paths: `${dbid}_types_voie`,
    abilities: `${dbid}_types_capacite`,
    races: `${dbid}_types_races`,
  };
  let url = req.url.split('/');
  const table = tables[url[1]];

  const sql = `select * from ${table}`;

  trace.output(sql);

  db.query(
    {
      sql: sql,
    },
    function (err, result) {
      if (err) throw err;
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        res.status(200).json({
          rs: result,
        });
      }
    }
  );
});

module.exports = router;
