const express = require('express');
const router = express.Router();

const datasets = require('../datasets.json');

router.get('/', (req, res, next) => {
  const includeAll = parseInt(req.query.all) || 0;
  const data = datasets.filter(
    (dataset) => includeAll == 1 || !dataset.hidden || false
  );
  res.status(200).json({
    rs: data,
  });
});

module.exports = router;
