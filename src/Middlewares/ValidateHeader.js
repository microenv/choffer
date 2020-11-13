const JoiValidationError = require("../Errors/JoiValidationError");

module.exports = function ValidateHeader({ name, schema, errorMessage }) {
  return (req, res, next) => {
    const resValidate = schema.required().validate(req.headers[name]);

    if (resValidate.error) {
      throw new JoiValidationError(
        errorMessage || resValidate,
        "choffer_midvl100"
      );
    }

    next();
  };
};
