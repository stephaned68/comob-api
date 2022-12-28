const express = require('express');
const router = express.Router();
const { int, Ok } = require('../lib');

const datasets = require('../datasets.json');

router.get('/', (req, res, next) => {
  const includeAll = int(req.query.all);
  const data = datasets.filter(
    (dataset) => includeAll == 1 || !dataset.hidden || false
  );
  Ok(res, data);
});

module.exports = router;
