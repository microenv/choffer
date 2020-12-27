import * as _ from 'lodash';
import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import JoiValidationError from '../../Errors/JoiValidationError';

export default function ValidateRequest(key: string, schema: Joi.Schema, joiOptions: Joi.ValidationOptions = {}) {
  return (req: any, res: Response, next: NextFunction) => {
    const resValidate = schema.required().validate(
      req[key],
      _.merge(
        {
          stripUnknown: true,
        },
        joiOptions
      )
    );

    if (resValidate.error) {
      throw new JoiValidationError(resValidate, 'choffer_midvr82');
    }

    req[key] = resValidate.value;

    next();
  };
}
