/**
 * Races routes
 */

const express = require('express');
const router = express.Router();

const knex = require('../dbknex');
const { errorNotFound } = require('../errors');
const { dsExists, stringOrDefault, Ok } = require('../lib');
const trace = require('../trace');

/**
 * Route : /races/{:dataset}/?types=xxxx,xxxx,xxxx
 * Return the races for a given list of types
 */
router.get('/:ds', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  where = '';

  const typeList = stringOrDefault(req.query.types);
  let typeIn = '';
  let types = [];
  let orNull = '';
  if (typeList !== '') {
    types = typeList.split(',');
    for (const type of types) {
      if (type === 'base') {
        orNull = ' or type_race is null';
      } else {
        typeIn += `,'${type}'`;
      }
    }
    where = `type_race in (${typeIn.slice(1)})${orNull}`;
  } else {
    where = 'type_race is null';
  }

  const sql = [`select * from ${dbid}_races where `, where].join(' ');

  trace.output(sql);

  knex
    .select()
    .from(`${dbid}_races`)
    .where(knex.raw(where))
    .then(function (result) {
      if (result.length == 0) {
        errorNotFound(res);
      } else {
        Ok(res, result);
      }
    })
    .catch(function (error) {
      if (error) throw { message: error.message };
    });
});

/**
 * Route : /races/{:dataset}/{:race}
 * Return a race record
 */
router.get('/:ds/:race', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  const race = stringOrDefault(req.params.race);
  if (race === '') throw { status:400, message:'Required URL argument not found' };

  const sql = [`select * from ${dbid}_races`, 'where race = ?'].join(' ');

  trace.output(sql);

  knex
    .select()
    .from(`${dbid}_races`)
    .where('race', race)
    .then(function (result) {
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
