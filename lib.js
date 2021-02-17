module.exports = {
  dsExists: function (ds) {
    const datasets = require('./datasets.json');
    return datasets.findIndex((dataset) => dataset.dbid == ds) != -1;
  },
};
