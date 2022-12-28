/**
 * Categories routes
 */

const express = require('express');
const router = express.Router();

const knex = require('../dbknex');
const { errorNotFound } = require('../errors');
const { dsExists, stringOrDefault, Ok } = require('../lib');
const trace = require('../trace');

/**
 * Route: /categories/{:dataset}
 * Return list of categories for a dataset
 */
router.get('/:ds', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  const sql = [
    `select * from ${dbid}_categories_equipement`,
    "where parent is null or parent = ''",
    'order by',
    ['sequence', 'code'].join(', '),
  ].join(' ');

  trace.output(sql);

  knex
    .select()
    .from(`${dbid}_categories_equipement`)
    .whereNull('parent')
    .orWhere('parent', '')
    .orderBy('sequence', 'code')
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

/**
 * Roue: /categories/{:dataset}/{:parent}
 * Return list of sub-categories for a dataset and parent category
 */
router.get('/:ds/:parent', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  const parent = stringOrDefault(req.params.parent);

  const sql = [
    `select * from ${dbid}_categories_equipement`,
    'where parent = ?',
    "and sequence < '90000'",
    'order by',
    ['sequence', 'code'].join(', '),
  ].join(' ');

  trace.output(sql);

  knex
    .select()
    .from(`${dbid}_categories_equipement`)
    .where('parent', parent)
    .where('sequence', '<', '90000')
    .orderBy('sequence', 'code')
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
