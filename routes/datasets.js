const express = require('express');
const router = express.Router();

const datasets = require('../datasets.json');

router.get('/', (req, res, next) => {
  const data = datasets.filter((dataset) => !dataset.hidden || false);
  res.status(200).json({
    rs: data,
  });
});

module.exports = router;
