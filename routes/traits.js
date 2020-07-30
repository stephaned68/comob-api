/**
 * Traits routes
 */

const express = require('express');
const router = express.Router();

const db = require('../dbconnect');

const trace = require('../trace');

/**
 * Route : /traits/{:dataset}/?race=xxxx
 * Return the racial traits for a given race
 * Route : /traits/{:dataset}/?profile=xxxx
 * Return the special traits for a given profile
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  
  const race = req.query.race || '';
  const profile = req.query.profile || '';

  if (race === '' && profile === '') {
    throw 'Required URL argument not found';
  }
  if (race !== '' && profile !== '') {
    throw 'Too many URL arguments passed in';
  }


  let sql = '';

  if (race !== '') {
    sql = [
      'select',
      [
        'intitule',
        'description'
      ].join(', '),
      `from ${dbid}_races_traits`,
      `where race = '${race}'`
    ].join(' ');
  }

  if (profile !== '') {
    sql = [
      'select',
      [
        'intitule',
        'description'
      ].join(', '),
      `from ${dbid}_profils_traits`,
      `where profil = '${profile}'`
    ].join(' ');
  }

  trace.output(sql);
  
  db.query({
      sql: sql,
      values: []
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