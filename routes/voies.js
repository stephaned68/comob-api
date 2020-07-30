/**
 * Paths routes
 */

const express = require('express');
const router = express.Router();

const db = require('../dbconnect');

const trace = require('../trace');

/**
 * Route : /paths/{:dataset}/?type=xxxxx
 * Return the paths for a given special type
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  
  let type = req.query.type || '';

  if (type === '') throw 'Required URL argument not found';

  const sql = [
    `select vo.* from ${dbid}_voies as vo`,
    `where vo.type = ?`
  ].join(' ');

  trace.output(sql);

  db.query({
      sql: sql,
      values: [
        type
      ]
    },
    function (err, result) {
      if (err) throw err;
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        res.status(200).json({
          rs: result
        });
      }
    }
  );

});

/**
 * Route : /paths/{:dataset}/{:profile}
 * Return paths for a profile
 * Route : /paths/{:dataset}/{:profile}/?abilities
 * Return abilities detailed by paths for a profile
 */
router.get('/:ds/:profile', (req, res, next) => {

  const dbid = req.params.ds;
  const profile = decodeURI(req.params.profile);

  let sql = '';
  const abilitiesFlg = (Object.keys(req.query).indexOf('abilities') != -1);

  if (abilitiesFlg) {
    sql = [
      'select',
      [
        'pr.nom as profil',
        'vo.*',
        [
          'case vo.pfx_deladu',
          "when 0 then 'du '",
          "when 1 then 'de la '",
          "when 2 then 'de l\u2019'",
          "when 3 then 'des '",
          'end as voie_deladu'
        ].join(' '),
        'tv.type_voie_intitule',
        'cv.rang as rang',
        'ca.nom as capacite'
      ].join(', '),
      `from ${dbid}_voies_profils as vp`,
      `inner join ${dbid}_profils as pr on pr.profil = vp.profil`,
      `inner join ${dbid}_voies as vo on vo.voie = vp.voie`,
      `left join ${dbid}_types_voie as tv on tv.type_voie = vo.type`,
      `left join ${dbid}_capacites_voies as cv on cv.voie = vo.voie`,
      `inner join ${dbid}_capacites as ca on ca.capacite = cv.capacite`,
      'where vp.profil = ?',
      'order by vo.type, vo.voie, cv.rang'
    ].join(' ');
  } else {
    sql = [
      'select',
      [
        'vo.*',
        'tv.type_voie_intitule'
      ].join(', '),
      `from ${dbid}_voies_profils as vp`,
      `inner join ${dbid}_voies as vo on vp.voie = vo.voie`,
      `left join ${dbid}_types_voie as tv on vo.type = tv.type_voie`,
      `where vp.profil = ?`,
      `order by vo.type, vo.voie`
    ].join(' ');
  }

  trace.output(sql);

  db.query({
      sql: sql,
      values: [
        profile
      ]
    },
    function (err, result) {
      if (err) throw err;
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        res.status(200).json({
          rs: result
        });
      }
    }
  );
});

module.exports = router;