/**
 * Equipment routes
 */

const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

/**
 * Route : /equipments/{:dataset}/?profile=xxxx
 * Return the base equipment for a give profile
 */
router.get('/:ds', (req, res, next) => {

  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);

  let profile = req.query.profile || '';

  if (profile === '') throw 'Required URL argument not found';

  const sql = [
    'select',
    [
      'eq.code as code',
      'eq.designation as designation',
      'ep.nombre as nombre',
      'ep.special as special',
      'group_concat(concat_ws(" : ", pr.intitule, pe.valeur) separator "~") as props'
    ].join(", "),
    `from ${dbid}_equipement_profils as ep`,
    `inner join ${dbid}_equipement as eq on eq.code = ep.equipement`,
    `left join ${dbid}_equipement_proprietes as pe on pe.code_equipement = eq.code`,
    `left join ${dbid}_proprietes_equipement as pr on pe.code_propriete = pr.code`,
    'where ep.profil = ?',
    'group by',
    [
      'ep.sequence',
      'eq.code',
    ].join(", "),
    'order by',
    [
      'ep.sequence',
      'eq.code',
      'pr.code'
    ].join(", ")
  ].join(" ");

  conn.connect(function (err) {
    if (err) throw err;
    conn.query({
        sql: sql,
        values: [
          profile
        ]
      },
      function (err, result) {
        if (err) throw err;
        res.status(200).json({
          rs: result
        });
        conn.end();
      });
  });

});

/**
 * Route : /equipments/{:dataset}/{:subcategory}
 * Return the equipments for a given subcategory
 */
router.get('/:ds/:category', (req, res, next) => {
  
  const dbid = req.params.ds;
  const conn = dbConnect.getConn(dbid);
  const category = decodeURI(req.params.category);

  const sql = [
    'select',
    [
      'eq.code as code',
      'eq.designation as designation',
      'ca.libelle as categorie',
      'eq.prix as prix',
      'eq.notes as notes',
      "group_concat(concat_ws(' : ', pe.intitule, ep.valeur) separator '~')as props"
    ].join(", "),
    `from ${dbid}_equipement as eq`,
    `inner join ${dbid}_categories_equipement as ca on eq.categorie = ca.code`,
    `left join ${dbid}_equipement_proprietes as ep on eq.code = ep.code_equipement`,
    `left join ${dbid}_proprietes_equipement as pe on ep.code_propriete = pe.code`,
    'where eq.categorie = ?',
    'group by',
    [
      'ca.code',
      'eq.code',
    ].join(", "),
    'order by',
    [
      'ca.parent',
      'ca.sequence',
      'ca.code',
      'eq.code',
      'pe.code'
    ].join(", ")
  ].join(" ");

  conn.connect(function (err) {
    if (err) throw err;
    conn.query({
        sql: sql,
        values: [
          category
        ]
      },
      function (err, result) {
        if (err) throw err;
        res.status(200).json({
          rs: result
        });
        conn.end();
      })
  });

});

module.exports = router;