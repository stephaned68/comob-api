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
    familyIn = `where ${dbid}_profils.famille in (${familyIn.slice(1)})`;
  }

  const sql = [
    `select * from ${dbid}_profils`,
    `inner join ${dbid}_familles as fa on ${dbid}_profils.famille = fa.famille`,
    familyIn,
    `order by profil`
  ].join(" ");

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