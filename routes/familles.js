/**
 * Families routes
 */

const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

const trace = require('../trace');

/**
 * Route: /families/{:dataset}
 * Return list of families for a dataset
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getPool(dbid);
  const sql = `select * from ${dbid}_familles`;

  trace.output(sql);

  conn.query(sql, function (err, result) {
    conn.end();
    if (err) throw err;
    if (result.length == 0) {
      res.sendStatus(404);
    } else {
      res.status(200).json({
        rs: result
      });
    }
  });
  
});

module.exports = router;