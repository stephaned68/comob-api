const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

router.get('/:ds/:voie', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);
  const voie = req.params.voie;

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
      values: [voie]
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