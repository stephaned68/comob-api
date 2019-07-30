/**
 * Abilities routes
 */

const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

/**
 * Route : /abilities/{:dataset}
 * Return epic abilities
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);

  const sql = [
    `select ca.* from ${dbid}_capacites as ca`,
    `where ca.type = '3'`
  ].join(" ")

  conn.connect(function (err) {
    if (err) throw err;
    conn.query({
        sql: sql,
        values: []
      },
      function (err, result) {
        if (err) throw err;
        res.status(200).json({
          rs: result
        });
      })
  });

});

/**
 * Route : /abilities/{:ds}/{:path}
 * Return abilities for a given path
 */
router.get('/:ds/:path', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);
  const path = req.params.path;

  const sql = [
    `select cv.rang, ca.* from ${dbid}_capacites_voies as cv`,
    `inner join ${dbid}_capacites as ca on cv.capacite = ca.capacite`,
    `where cv.voie = ?`,
    `order by cv.rang`
  ].join(" ");

  conn.connect(function (err) {
    if (err) throw err;
    conn.query({
        sql: sql,
        values: [
          path
        ]
      },
      function (err, result) {
        if (err) throw err;
        res.status(200).json({
          rs: result
        });
      })
  });

});

module.exports = router;