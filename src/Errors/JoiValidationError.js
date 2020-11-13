const CustomError = require("./CustomError");

module.exports = class JoiValidationError extends CustomError {
  constructor(joiValidateResponse, errorCode, _debug) {
    let errorMessage = "Erro ao validar dados";
    if (joiValidateResponse) {
      if (joiValidateResponse.error) {
        errorMessage = joiValidateResponse.error;
      } else {
        errorMessage = String(joiValidateResponse);
      }
    }
    super(400, errorMessage, errorCode, _debug);
  }
};
