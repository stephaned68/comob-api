const colors = require('colors/safe');

module.exports = {
  
  // check if ds exists
  dsExists: function (ds) {
    const datasets = require('../datasets.json');
    return datasets.findIndex((dataset) => dataset.dbid == ds) != -1;
  },

  // return ds
  getDataset: function (ds) {
    const datasets = require('../datasets.json');
    return datasets[datasets.findIndex((dataset) => dataset.dbid == ds)];
  },

  // integer
  intval: function (value, onError = 0) {
    return parseInt(value) || onError;
  },

  // float
  numval: function (value, onError = 0) {
    return parseFloat(value) || onError;
  },

  // string or default
  strval: function (value, onError = '') {
    return value || onError;
  },

  // Return 200 OK response
  Ok: function (response, result) {
    response.status(200).json({
      rs: result,
    });
  }
};
