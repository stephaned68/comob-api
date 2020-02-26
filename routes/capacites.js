/**
 * Abilities routes
 */

const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

/**
 * Route : /abilities/{:dataset}/?type=xxxxx
 * Return epic abilities
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);

  let type = req.query.type || '';
  let profile = req.query.profile || '';

  if (type !== '' && profile !== '') throw 'Only one URL argument can be passed';
  if (type === '' && profile === '') throw 'Required URL argument not found';

  let sql = '';

  if (type !== '') {
    sql = [
      `select ca.* from ${dbid}_capacites as ca`,
      `where ca.type = '${type}'`
    ].join(" ");
  }

  if (profile !== '') {
    sql = [
      'select',
      'pr.nom as profil,',
      'vo.nom as voie,',
      'cv.rang as rang,',
      'ca.nom as capacite,',
      'ca.limitee as limitee,',
      'ca.sort as sort,',
      'ca.description as description',
      `from ${dbid}_voies_profils as vp`,
      `join ${dbid}_profils as pr on pr.profil = vp.profil`,
      `join ${dbid}_capacites_voies as cv on cv.voie = vp.voie`,
      `join ${dbid}_voies as vo on vo.voie = cv.voie`,
      `join ${dbid}_capacites as ca on ca.capacite = cv.capacite`,
      `where pr.profil = '${profile}'`,
      'order by vp.profil, vp.voie, cv.rang'
    ].join(" ");
  }

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
        conn.end();
      });
  });

});

/**
 * Route : /abilities/{:ds}/{:path}
 * Return abilities for a given path
 */
router.get('/:ds/:path', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);
  const path = decodeURI(req.params.path);

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