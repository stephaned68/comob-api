const express = require('express');
const router = express.Router();
const { intval, Ok } = require('../core/lib');

const datasets = require('../datasets.json');

router.get('/', (req, res, next) => {
  const { all: includeAll = '0', cof2: includeCOF2 = '0' } = req.query;
  const data = datasets.filter((dataset) => {
    if (intval(includeAll) === 1) 
      return true;
    if (intval(includeCOF2) === 1 && dataset.dbid === "cof2") 
      return true;
    const hidden = dataset.hidden || false;
    return !hidden;
  });
  console.log(data.map(ds => ds.dbid));
  Ok(res, data);
});

module.exports = router;
