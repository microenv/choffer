import JoiValidationError from '../../Errors/JoiValidationError';
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import Databases from '../../Databases';

export type InsertedObject = any;

export type DatabaseInsertConfig = {
  connection?: string;
  table: string;
  primaryKey?: string;
  schema: Joi.Schema;
  parseBeforeInsert?: (obj: any) => any;
  parseAfterInsert?: (result: InsertedObject) => any;
}

export default function DatabaseInsertOne(config: DatabaseInsertConfig) {
  const runBefore = async (body: any) => {
    if (config.parseBeforeInsert) {
      return await config.parseBeforeInsert(JSON.parse(JSON.stringify(body)));
    }

    return body;
  }

  const runAfter = async (result: InsertedObject) => {
    if (config.parseAfterInsert) {
      return await config.parseAfterInsert(result);
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

      const insertData = await runBefore(resValidate.value);

      const db = Databases.Database(config.connection);

      const primaryKey = config.primaryKey || 'id';

      const insResult = await db(config.table, [primaryKey]).insert(insertData);

      const qryResult = await db(config.table).where({ [primaryKey]: insResult[0] }).first();

      const finalResult = await runAfter(qryResult);

      res.json(finalResult);
    } catch (error) {
      next(error);
    }
  };
}
