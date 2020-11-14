import CustomError from './CustomError';
import Joi from 'joi';

export default class JoiValidationError extends CustomError {
  constructor(joiValidateResponse: Joi.ValidationResult | string, errorCode: string = '', _debug?: any) {
    let errorMessage: string = 'Erro ao validar dados';
    if (typeof joiValidateResponse === 'string') {
      errorMessage = joiValidateResponse;
    } else {
      if (joiValidateResponse.error) {
        errorMessage = String(joiValidateResponse.error);
      } else {
        errorMessage = String(joiValidateResponse);
      }
    }
    super(400, errorMessage, errorCode, _debug);
  }
}
