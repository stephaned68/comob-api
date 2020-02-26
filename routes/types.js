/**
 * Types routes
 */

const express = require('express');
const router = express.Router();

const dbConnect = require('../dbconnect');

/**
 * Route : /paths/{:dataset}
 * Return the list of special path types
 */
router.get(
  [
    '/paths/:ds',
    '/abilities/:ds'
  ], (req, res, next) => {

    const dbid = req.params.ds;
    const conn = dbConnect.getConn(dbid);

    const tables = {
      "paths": `${dbid}_types_voie`,
      "abilities": `${dbid}_types_capacite`
    };
    let url = req.url.split('/');
    const table = tables[url[1]];

    const sql = `select * from ${table}`;

    conn.connect(function (err) {
      if (err) throw err;
      conn.query({
          sql: sql
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

module.exports = router;