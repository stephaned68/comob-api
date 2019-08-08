/**
 * Families routes
 */

const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

/**
 * Route: /families/{:dataset}
 * Return list of families for a dataset
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);
  const sql = `select * from ${dbid}_familles`;

  conn.connect(function (err) {
    if (err) throw err;
    conn.query(sql, function (err, result) {
      if (err) throw err;
      res.status(200).json({
        rs: result
      });
    })
  });
});

module.exports = router;