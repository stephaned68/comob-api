/**
 * Families routes
 */

const express = require('express');
const router = express.Router();

const knex = require('../dbknex');
const { errorNotFound } = require('../errors');
const { dsExists, stringOrDefault, Ok } = require('../lib');
const trace = require('../trace');

/**
 * Route: /families/{:dataset}
 * Return list of families for a dataset
 */
router.get('/:ds', (req, res, next) => {
  const dbid = stringOrDefault(req.params.ds);
  if (!dsExists(dbid)) {
    throw { status:404, message:'Unknown dataset' };
  }

  const sql = `select * from ${dbid}_familles`;

  trace.output(sql);

  knex
    .select()
    .from(`${dbid}_familles`)
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
