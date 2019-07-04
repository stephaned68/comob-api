const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

router.get('/:ds/:profil', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);
  const profil = req.params.profil;

  const sql = [
    `select vo.* from ${dbid}_voies_profils as vp`,
    `inner join ${dbid}_voies as vo on vp.voie = vo.voie`,
    `where vp.profil = ?`
  ].join(" ");

  conn.connect(function (err) {
    if (err) throw err;
    conn.query({
      sql: sql,
      values: [profil]
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