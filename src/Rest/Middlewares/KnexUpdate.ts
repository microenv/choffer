import * as _ from 'lodash';
import JoiValidationError from '../../Errors/JoiValidationError';
import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import Databases from '../../Databases';
import BadRequestError from '../../Errors/BadRequestError';

export type UpdatedObject = any;

export type KnexUpdateConfig = {
  connection?: string;
  table: string;
  primaryKey?: string;
  schema: Joi.Schema;
  whereIdValue?: string;
  where?: (req: Request, query: any) => void;
  parseBeforeUpdate?: (obj: any) => any;
  parseAfterUpdate?: (result: UpdatedObject) => any;
}

export default function KnexUpdate(config: KnexUpdateConfig) {
  const runBefore = async (body: any) => {
    if (config.parseBeforeUpdate) {
      return await config.parseBeforeUpdate(JSON.parse(JSON.stringify(body)));
    }

    return body;
  }

  const runAfter = async (result: UpdatedObject) => {
    if (config.parseAfterUpdate) {
      return await config.parseAfterUpdate(result);
    }

    return result;
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body) {
        throw new BadRequestError(
          `Nenhum campo recebido para fazer o update`,
        );
      }

      const resValidate = config.schema.required().validate(req.body);

      if (resValidate.error) {
        throw new JoiValidationError(
          resValidate,
          'choffer_middb_4443'
        );
      }

      const updateData = await runBefore(resValidate.value);

      const db = Databases.Database(config.connection);

      const primaryKey = config.primaryKey || 'id';

      const whereCallback = config.where ? (builder: any) => {
        (config as any).where(req, builder);
      } : (builder: any) => {
        const primaryValuePath = config.whereIdValue || 'params.id';
        const primaryValue = _.get(req, primaryValuePath)

        if (!primaryValue) {
          throw new BadRequestError(
            `O campo "${primaryValuePath}" precisa estar preenchido!`
          );
        }
        builder.where(primaryKey, '=', primaryValue)
      };

      const updResult = await db(config.table)
        .where(whereCallback)
        .update(updateData, [primaryKey]);

      const qryResult = await db(config.table).where(whereCallback).first();

      const finalResult = await runAfter(qryResult);

      res.json(finalResult);
    } catch (error) {
      next(error);
    }
  };
}
