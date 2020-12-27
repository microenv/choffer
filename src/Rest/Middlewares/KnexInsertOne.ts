import JoiValidationError from '../../Errors/JoiValidationError';
import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import Databases from '../../Databases';

export type InsertedObject = any;

export type KnexInsertConfig = {
  connection?: string;
  table: string;
  primaryKey?: string;
  schema: Joi.Schema;
  parseBeforeInsert?: (body: any, req: Request) => Promise<any>;
  parseAfterInsert?: (result: InsertedObject, req: Request) => Promise<any>;
}

export default function KnexInsertOne(config: KnexInsertConfig) {
  const runBefore = async (body: any, req: Request) => {
    if (config.parseBeforeInsert) {
      return await config.parseBeforeInsert(JSON.parse(JSON.stringify(body)), req);
    }

    return body;
  }

  const runAfter = async (result: InsertedObject, req: Request) => {
    if (config.parseAfterInsert) {
      return await config.parseAfterInsert(result, req);
    }

    return result;
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resValidate = config.schema.required().validate(req.body);

      if (resValidate.error) {
        throw new JoiValidationError(
          resValidate,
          'choffer_middb_3542'
        );
      }

      const insertData = await runBefore(resValidate.value, req);

      const db = Databases.Database(config.connection);

      const primaryKey = config.primaryKey || 'id';

      const insResult = await db(config.table, [primaryKey]).insert(insertData);

      const qryResult = await db(config.table).where({ [primaryKey]: insResult[0] }).first();

      const finalResult = await runAfter(qryResult, req);

      res.json(finalResult);
    } catch (error) {
      next(error);
    }
  };
}
