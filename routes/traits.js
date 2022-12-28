/**
 * Traits routes
 */

const express = require('express');
const router = express.Router();

const knex = require('../dbknex');
const { errorNotFound } = require('../errors');

const { dsExists, stringOrDefault, Ok } = require('../lib');

const trace = require('../trace');

/**
 * Route : /traits/{:dataset}/?race=xxxx
 * Return the racial traits for a given race
 * Route : /traits/{:dataset}/?profile=xxxx
 * Return the special traits for a given profile
 */
router.get('/:ds', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  const race = stringOrDefault(req.query.race);
  const profile = stringOrDefault(req.query.profile);

  if (race === '' && profile === '') {
    throw { status:400, message:'Required URL argument not found' };
  }
  if (race !== '' && profile !== '') {
    throw { status:400, message:'Too many URL arguments passed in' };
  }

  let sql = '';
  let qb = null;

  if (race !== '') {
    sql = [
      'select',
      ['intitule', 'description'].join(', '),
      `from ${dbid}_races_traits`,
      `where race = '${race}'`,
    ].join(' ');
    qb = knex
      .select('intitule', 'description')
      .from(`${dbid}_races_traits`)
      .where('race', race);
  }

  if (profile !== '') {
    sql = [
      'select',
      ['intitule', 'description'].join(', '),
      `from ${dbid}_profils_traits`,
      `where profil = '${profile}'`,
    ].join(' ');
    qb = knex
      .select('intitule', 'description')
      .from(`${dbid}_profils_traits`)
      .where('profil', profile);
  }

  trace.output(sql);

  qb.then(function (result) {
    if (result.length == 0) {
      errorNotFound(res);
    } else {
      Ok(res, result);
    }
  }).catch(function (error) {
    if (error) throw { message: error.message };
  });
});

module.exports = router;
