module.exports = {
  // check if ds exists
  dsExists: function (ds) {
    const datasets = require('./datasets.json');
    return datasets.findIndex((dataset) => dataset.dbid == ds) != -1;
  },
  // return ds
  getDataset: function (ds) {
    const datasets = require('./datasets.json');
    return datasets[datasets.findIndex((dataset) => dataset.dbid == ds)];
  },
};
