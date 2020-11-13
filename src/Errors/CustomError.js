module.exports = class CustomError extends Error {
  constructor(httpStatus, errorMessage, errorCode, _debug) {
    super(errorMessage);

    this.httpStatus = httpStatus;
    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
    this._debug = _debug;

    this.isChofferError = true;
  }
};
