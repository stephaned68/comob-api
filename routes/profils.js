/**
 * Profiles routes
 */

const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

/**
 * Route: /profiles/{:dataset}
 * Return list of profiles for a dataset
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);

  const familyList = req.query.family || '';
  let familyIn = '';
  if (familyList !== '') {
    families = familyList.split(',');
    for (const family of families) {
      familyIn += `,'${family}'`;
    }
    familyIn = ` where famille in (${familyIn.slice(1)})`;
  }

  const sql = `select * from ${dbid}_profils` + familyIn;

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