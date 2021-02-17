/**
 * Categories routes
 */

const express = require('express');
const router = express.Router();

const db = require('../dbconnect');

const { dsExists } = require('../lib');

const trace = require('../trace');

/**
 * Route: /categories/{:dataset}
 * Return list of categories for a dataset
 */
router.get('/:ds', (req, res, next) => {
  const dbid = req.params.ds;
  if (!dsExists(dbid)) {
    throw 'Unknown dataset';
  }

  const sql = [
    `select * from ${dbid}_categories_equipement`,
    "where parent is null or parent = ''",
    'order by',
    ['sequence', 'code'].join(', '),
  ].join(' ');

  trace.output(sql);

  db.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length == 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json({
        rs: result,
      });
    }
  });
});

/**
 * Roue: /categories/{:dataset}/{:parent}
 * Return list of sub-categories for a dataset and parent category
 */
router.get('/:ds/:parent', (req, res, next) => {
  const dbid = req.params.ds;
  if (!dsExists(dbid)) {
    throw 'Unknown dataset';
  }

  const parent = req.params.parent;

  const sql = [
    `select * from ${dbid}_categories_equipement`,
    'where parent = ?',
    "and sequence < '90000'",
    'order by',
    ['sequence', 'code'].join(', '),
  ].join(' ');

  trace.output(sql);

  db.query(
    {
      sql: sql,
      values: [parent],
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
