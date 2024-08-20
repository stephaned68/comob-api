const express = require('express');
const router = express.Router();
const { int, Ok } = require('../core/lib');

const datasets = require('../datasets.json');

router.get('/', (req, res, next) => {
  const includeAll = int(req.query.all);
  const includeCOF2 = int(req.query.cof2);
  const data = datasets.filter((dataset) => {
    if (includeAll === 1) return true;
    if (includeCOF2 === 1 && dataset.dbid === "cof2") return true;
    const hidden = dataset.hidden || false;
    return !hidden;
  });
  console.log(data.map(ds => ds.dbid));
  Ok(res, data);
});

module.exports = router;
