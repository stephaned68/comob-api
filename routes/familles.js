/**
 * Families routes
 */

const express = require('express');
const router = express.Router();

const knex = require('../dbknex');

const { dsExists, stringOrDefault } = require('../lib');

const trace = require('../trace');

/**
 * Route: /families/{:dataset}
 * Return list of families for a dataset
 */
router.get('/:ds', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw 'Unknown dataset';
  }

  const sql = `select * from ${dbid}_familles`;

  trace.output(sql);

  knex
    .select()
    .from(`${dbid}_familles`)
    .then(function (result) {
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
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
