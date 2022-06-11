/**
 * Abilities routes
 */

const express = require('express');
const router = express.Router();

const knex = require('../dbknex');

const { dsExists } = require('../lib');

const trace = require('../trace');

/**
 * Routes :
 * /abilities/{:dataset}/?type=xxxxx
 * Return abilities of a given type
 * /abilities/{:dataset}/?profile=xxxxx
 * Return abilities for a given profile
 * /abilities/{:dataset}/?race=xxxxx
 * Return abilities for a given race
 */
router.get('/:ds', (req, res, next) => {
  const dbid = req.params.ds;
  if (!dsExists(dbid)) {
    throw 'Unknown dataset';
  }

  let type = req.query.type || '';
  let profile = req.query.profile || '';
  let race = req.query.race || '';

  if (type !== '' && profile !== '' && race !== '') {
    throw 'Only one URL argument can be passed';
  }
  if (type === '' && profile === '' && race === '') {
    throw 'Required URL argument not found';
  }

  let sql = '';

  if (type !== '') {
    sql = [
      `select ca.* from ${dbid}_capacites as ca`,
      `where ca.type = '${type}'`,
    ].join(' ');
  }

  if (profile !== '') {
    sql = [
      'select',
      [
        'pr.nom as profil',
        'vo.nom as voie',
        'cv.rang as rang',
        'ca.nom as capacite',
        'ca.limitee as limitee',
        'ca.sort as sort',
        'ca.description as description',
        [
          'case pfx_deladu',
          "when 0 then 'du '",
          "when 1 then 'de la '",
          "when 2 then 'de l\u2019'",
          "when 3 then 'des '",
          'end as voie_deladu',
        ].join(' '),
        'vo.notes as voie_notes',
      ].join(', '),
      `from ${dbid}_voies_profils as vp`,
      `join ${dbid}_profils as pr on pr.profil = vp.profil`,
      `join ${dbid}_capacites_voies as cv on cv.voie = vp.voie`,
      `join ${dbid}_voies as vo on vo.voie = cv.voie`,
      `join ${dbid}_capacites as ca on ca.capacite = cv.capacite`,
      `where pr.profil = '${profile}'`,
      'order by vp.profil, vp.voie, cv.rang',
    ].join(' ');
  }

  if (race !== '') {
    sql = [
      'select',
      [
        'ca.nom as capacite',
        'ca.description as description',
        'ca.limitee as limitation',
      ].join(', '),
      `from ${dbid}_races_capacites as cr`,
      `join ${dbid}_capacites as ca on ca.capacite = cr.capacite`,
      `where cr.race = '${race}'`,
      'order by limitation, capacite',
    ].join(' ');
  }

  trace.output(sql);

  knex
    .raw(sql)
    .then(function (result) {
      result = result[0];
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        res.status(200).json({
          rs: result,
        });
      }
    })
    .catch(function (error) {
      if (error) throw error;
    });
});

/**
 * Route : /abilities/{:ds}/{:path}
 * Return abilities for a given path
 */
router.get('/:ds/:path', (req, res, next) => {
  const dbid = req.params.ds;
  if (!dsExists(dbid)) {
    throw 'Unknown dataset';
  }
  const path = decodeURI(req.params.path);

  const sql = [
    'select',
    [
      'cv.rang',
      'ca.*',
      'vo.nom as voie',
      [
        'case vo.pfx_deladu',
        "when 0 then 'du '",
        "when 1 then 'de la '",
        "when 2 then 'de l\u2019'",
        "when 3 then 'des '",
        'end as voie_deladu',
      ].join(' '),
    ].join(', '),
    `from ${dbid}_capacites_voies as cv`,
    `inner join ${dbid}_capacites as ca on cv.capacite = ca.capacite`,
    `inner join ${dbid}_voies as vo on vo.voie = cv.voie`,
    `where cv.voie = ?`,
    `order by cv.rang`,
  ].join(' ');

  trace.output(sql);

  knex
    .raw(sql, [path])
    .then(function (result) {
      result = result[0];
      if (result.length == 0) {
        res.sendStatus(404);
      } else {
        res.status(200).json({
          rs: result,
        });
      }
    })
    .catch(function (error) {
      if (error) throw error;
    });
});

module.exports = router;
