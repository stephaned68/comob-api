/**
 * Categories routes
 */

const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

/**
 * Route: /categories/{:dataset}
 * Return list of categories for a dataset
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);
  const sql = [
    `select * from ${dbid}_categories_equipement`,
    "where parent is null or parent = ''",
    'order by',
    [
      'sequence',
      'code'
    ].join(", ")
  ].join(" ");

  conn.connect(function (err) {
    if (err) throw err;
    conn.query(sql, function (err, result) {
      if (err) throw err;
      res.status(200).json({
        rs: result
      });
      conn.end();
    })
  });

});

/**
 * Roue: /categories/{:dataset}/{:parent}
 * Return list of sub-categories for a dataset and parent category
 */
router.get('/:ds/:parent', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);
  const parent = req.params.parent;

  const sql = [
    `select * from ${dbid}_categories_equipement`,
    'where parent = ?',
    "and sequence < '90000'",
    'order by',
    [
      'sequence',
      'code'
    ].join(" ,")
  ].join(" ");

  conn.connect(function (err) {
    if (err) throw err;
    conn.query({
          sql: sql,
          values: [
            parent
          ]
        }, function (err, result) {
      if (err) throw err;
      res.status(200).json({
        rs: result
      });
      conn.end();
    })
  });

});

module.exports = router;