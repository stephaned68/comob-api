/**
 * Paths routes
 */

const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

/**
 * Route : /paths/{:dataset}/?type=xxxxx
 * Return the paths for a given special type
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);

  let type = req.query.type || '';

  if (type === '') throw 'Need type=? on the URL';

  const sql = [
    `select vo.* from ${dbid}_voies as vo`,
    `where vo.type = ?`
  ].join(" ");

  conn.connect(function (err) {
    if (err) throw err;
    conn.query({
        sql: sql,
        values: [
          type
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

/**
 * Route : /paths/{:dataset}/{:profile}
 * Return paths for a profile
 */
router.get('/:ds/:profile', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);
  const profile = decodeURI(req.params.profile);

  const sql = [
    `select vo.*,tv.type_voie_intitule`,
    `from ${dbid}_voies_profils as vp`,
    `inner join ${dbid}_voies as vo on vp.voie = vo.voie`,
    `left join ${dbid}_types_voie as tv on vo.type = tv.type_voie`,
    `where vp.profil = ?`,
    `order by vo.type, vo.voie`
  ].join(" ");

  conn.connect(function (err) {
    if (err) throw err;
    conn.query({
        sql: sql,
        values: [
          profile
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