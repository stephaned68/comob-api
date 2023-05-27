const colors = require("colors/safe");

const sendErrorMessage = (response, status = 500, message = "Server Error") => {
  response.status(status).send({ error: message });
};

module.exports = {
  errorHandler: function (error, request, response, next) {
    let httpCode = 500;
    if (typeof error === "object") {
      httpCode = error.status || httpCode;
      message = error.message;
    }
    sendErrorMessage(response, httpCode, message);

    console.log(colors.bgRed.white(" ERROR : "), colors.red(message));
  },

  sendErrorMessage,

  errorNotFound: function (response, message = "Not Found") {
    sendErrorMessage(response, 404, message);
  },
};
