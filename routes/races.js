/**
 * Races routes
 */

const express = require('express');
const router = express.Router();

const knex = require('../dbknex');

const { dsExists, stringOrDefault } = require('../lib');

const trace = require('../trace');

/**
 * Route : /races/{:dataset}/?types=xxxx,xxxx,xxxx
 * Return the races for a given list of types
 */
router.get('/:ds', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw 'Unknown dataset';
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
 * Route : /races/{:dataset}/{:race}
 * Return a race record
 */
router.get('/:ds/:race', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw 'Unknown dataset';
  }

  const race = stringOrDefault(req.params.race);
  if (race === '') throw 'Required URL argument not found';

  const sql = [`select * from ${dbid}_races`, 'where race = ?'].join(' ');

  trace.output(sql);

  knex
    .select()
    .from(`${dbid}_races`)
    .where('race', race)
    .then(function (result) {
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
