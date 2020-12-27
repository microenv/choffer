import JoiValidationError from '../../Errors/JoiValidationError';
import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import Databases from '../../Databases';

export type SearchResponse = any[];

export type KnexSearchConfig = {
  connection?: string;
  table: string;
  where?: (req: Request, query: any) => void;
  parseBeforeSearch?: () => any;
  parseAfterSearch?: (result: SearchResponse) => any;
}

export default function KnexSearch(config: KnexSearchConfig) {
  const runBefore = async () => {
    if (config.parseBeforeSearch) {
      return await config.parseBeforeSearch();
    }
  }

  const runAfter = async (result: SearchResponse) => {
    if (config.parseAfterSearch) {
      return await config.parseAfterSearch(result);
    }

    return result;
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const db = Databases.Database(config.connection);

      await runBefore();

      let searchResult;

      if (config.where) {
        searchResult = await db(config.table).where((builder: any) => {
          (config as any).where(req, builder);
        }).select();
      } else {
        searchResult = await db(config.table).select();
      }

      const finalResult = await runAfter(searchResult);

      res.json(finalResult);
    } catch (error) {
      next(error);
    }
  };
}
