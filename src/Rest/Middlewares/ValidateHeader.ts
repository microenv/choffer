import JoiValidationError from '../../Errors/JoiValidationError';
import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

type ValidateHeaderProps = {
  name: string;
  schema: Joi.Schema;
  errorMessage?: string;
}

export default function ValidateHeader({ name, schema, errorMessage }: ValidateHeaderProps) {
  return (req: Request, res: Response, next: NextFunction) => {
    const resValidate = schema.required().validate(req.headers[name]);

    if (resValidate.error) {
      throw new JoiValidationError(
        errorMessage || resValidate,
        'choffer_midvl100'
      );
    }

    next();
  };
}
