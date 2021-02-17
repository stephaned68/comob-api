/**
 * Profiles routes
 */

const express = require('express');
const router = express.Router();

const db = require('../dbconnect');

const { dsExists } = require('../lib');

const trace = require('../trace');

/**
 * Route: /profiles/{:dataset}/?family=xxxx,xxxx,xxxx&type=xxxx
 * Return list of profiles for a dataset, filtering for :
 *   - an optional comma-separated list of families
 *   - and/or a type of profile
 */
router.get('/:ds', (req, res, next) => {
  const dbid = req.params.ds;
  if (!dsExists(dbid)) {
    throw 'Unknown dataset';
  }

  let wheres = [];

  const familyList = req.query.family || '';
  let familyIn = '';
  if (familyList !== '') {
    families = familyList.split(',');
    for (const family of families) {
      familyIn += `,'${family}'`;
    }
    wheres.push(`pr.famille in (${familyIn.slice(1)})`);
  }

  let type = req.query.type || '';
  if (type !== '') {
    wheres.push(`type='${type}'`);
  }

  let where = '';
  if (wheres.length !== 0) {
    where = 'where ' + wheres.join(' and ');
  }

  const sql = [
    'select',
    [
      'pr.profil as profil',
      'pr.nom as nom',
      'pr.description as description',
      'json_object("id", fa.famille, "libelle", fa.description) as famille',
    ].join(','),
    `from ${dbid}_profils as pr`,
    `inner join ${dbid}_familles as fa on pr.famille = fa.famille`,
    where,
    `order by profil`,
  ].join(' ');

  trace.output(sql);

  db.query(sql, function (err, result) {
    // db.end();
    if (err) throw err;
    if (result.length == 0) {
      res.sendStatus(404);
    } else {
      result.forEach((dataRow) => {
        dataRow.famille = JSON.parse(dataRow.famille);
      });
      res.status(200).json({
        rs: result,
      });
    }
  });
});

module.exports = router;
