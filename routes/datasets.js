const express = require('express');
const router = express.Router();
const { int } = require('../lib');

const datasets = require('../datasets.json');

router.get('/', (req, res, next) => {
  const includeAll = int(req.query.all);
  const data = datasets.filter(
    (dataset) => includeAll == 1 || !dataset.hidden || false
  );
  res.status(200).json({
    rs: data,
  });
});

module.exports = router;
