const CustomError = require("./CustomError");

module.exports = class ServerError extends CustomError {
  constructor(errorMessage, errorCode, _debug) {
    super(500, errorMessage, errorCode, _debug);
  }
};
