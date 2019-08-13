/**
 * Paths routes
 */

const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

/**
 * Route : /paths/{:dataset}/?type={1|2|racial|prestige}
 * Return the racial or prestige paths
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);

  let type = req.query.type || '';

  if (type === '') throw 'Need type=? on the URL';

  if (type !== "1" && type !== "2") {
    types = {
      "racial": "1",
      "prestige": "2"
    };
    type = types[type.toLowerCase()];
  }

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
    `select vo.* from ${dbid}_voies_profils as vp`,
    `inner join ${dbid}_voies as vo on vp.voie = vo.voie`,
    `where vp.profil = ?`
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