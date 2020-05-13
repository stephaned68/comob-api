const colors = require('colors/safe');

module.exports = {

  output: function (traceData) {
    if (process.env.DEBUG) {
      console.log(colors.blue(traceData));
    }
  }

};