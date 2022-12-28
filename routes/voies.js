/**
 * Paths routes
 */

const express = require('express');
const router = express.Router();

const knex = require('../dbknex');
const { errorNotFound } = require('../errors');
const { dsExists, stringOrDefault, Ok } = require('../lib');
const trace = require('../trace');

/**
 * Route : /paths/{:dataset}/?type=xxxxx
 * Return the paths for a given special type
 */
router.get('/:ds', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  let type = stringOrDefault(req.query.type);

  if (type === '') throw { status:400, message:'Required URL argument not found' };
  
  const sql = [
    `select vo.* from ${dbid}_voies as vo`,
    type === ' ' ?
      "where vo.type is null or vo.type = '' or vo.type = ?"
      : `where vo.type = ?`,
  ].join(' ');
  
  trace.output(sql);

  knex
    .raw(sql, [type])
    .then(function (result) {
      result = result[0];
      if (result.length == 0) {
        errorNotFound(res);
      } else {
        Ok(res, result);
      }
    })
    .catch(function (error) {
      if (error) throw { message:error.message };
    });
});

/**
 * Route : /paths/{:dataset}/{:profile}
 * Return paths for a profile
 * Route : /paths/{:dataset}/{:profile}/?abilities
 * Return abilities detailed by paths for a profile
 */
router.get('/:ds/:profile', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message: 'Not Found' };
  }

  const profile = decodeURI(req.params.profile);

  let sql = '';
  const abilitiesFlg = Object.keys(req.query).indexOf('abilities') != -1;

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
          'end as voie_deladu',
        ].join(' '),
        'tv.type_voie_intitule',
        'cv.rang as rang',
        'ca.nom as capacite',
      ].join(', '),
      `from ${dbid}_voies_profils as vp`,
      `inner join ${dbid}_profils as pr on pr.profil = vp.profil`,
      `inner join ${dbid}_voies as vo on vo.voie = vp.voie`,
      `left join ${dbid}_types_voie as tv on tv.type_voie = vo.type`,
      `left join ${dbid}_capacites_voies as cv on cv.voie = vo.voie`,
      `inner join ${dbid}_capacites as ca on ca.capacite = cv.capacite`,
      'where vp.profil = ?',
      'order by vo.type, vo.voie, cv.rang',
    ].join(' ');
  } else {
    sql = [
      'select',
      ['vo.*', 'tv.type_voie_intitule'].join(', '),
      `from ${dbid}_voies_profils as vp`,
      `inner join ${dbid}_voies as vo on vp.voie = vo.voie`,
      `left join ${dbid}_types_voie as tv on vo.type = tv.type_voie`,
      `where vp.profil = ?`,
      `order by vo.type, vo.voie`,
    ].join(' ');
  }

  trace.output(sql);
  
  knex
    .raw(sql, [profile])
    .then(function (result) {
      result = result[0];
      if (result.length == 0) {
        errorNotFound(res);
      } else {
        Ok(res, result);
      }
    })
    .catch(function (error) {
      if (error) throw { message:error.message };
    });
});

module.exports = router;
