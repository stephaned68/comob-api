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

  let wheres = [];

  const familyList = req.query.family || '';
  let familyIn = '';
  if (familyList !== '') {
    families = familyList.split(',');
    for (const family of families) {
      familyIn += `,'${family}'`;
    }
    wheres.push(`${dbid}_profils.famille in (${familyIn.slice(1)})`);
  }

  let type = req.query.type || '';
  if (type !== '') {
    wheres.push(`type='${type}'`);
  }

  let where = '';
  if (wheres.length !== 0) {
    where = 'where ' + wheres.join(' and ');
  }

  const sql = [
    `select * from ${dbid}_profils`,
    `inner join ${dbid}_familles as fa on ${dbid}_profils.famille = fa.famille`,
    where,
    `order by profil`
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

module.exports = router;