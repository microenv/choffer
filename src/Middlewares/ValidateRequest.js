const _ = require("lodash");
const JoiValidationError = require("../Errors/JoiValidationError");

module.exports = function ValidateRequest(key, schema, joiOptions = {}) {
  return (req, res, next) => {
    const resValidate = schema.validate(
      req[key],
      _.merge(
        {
          stripUnknown: true,
        },
        joiOptions
      )
    );

    if (resValidate.error) {
      throw new JoiValidationError(
        errorMessage || resValidate,
        "choffer_midvr82"
      );
    }

    req[key] = resValidate.value;

    next();
  };
};
