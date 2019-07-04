const express = require('express');
const router = express.Router();

const datasets = require('../datasets.json');

router.get('/', (req, res, next) => {
  res.status(200).json({
    rs: datasets
  });
});

module.exports = router;