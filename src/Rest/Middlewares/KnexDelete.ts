import * as _ from 'lodash';
import JoiValidationError from '../../Errors/JoiValidationError';
import { Request, Response, NextFunction } from 'express';
import Databases from '../../Databases';
import BadRequestError from '../../Errors/BadRequestError';

export type DeletedResponse = any;

export type KnexDeleteConfig = {
  connection?: string;
  table: string;
  where: (req: Request, builder: any) => void;
  onBeforeDelete?: (req: Request) => any;
  onAfterDelete?: (result: DeletedResponse, req: Request) => any;
}

export default function KnexDelete(config: KnexDeleteConfig) {
  const runBefore = async (req: Request) => {
    if (config.onBeforeDelete) {
      return await config.onBeforeDelete(req);
    }
  }

  const runAfter = async (result: DeletedResponse, req: Request) => {
    if (config.onAfterDelete) {
      return await config.onAfterDelete(result, req);
    }

    return result;
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await runBefore(req);

      const db = Databases.Database(config.connection);

      const whereCallback = (builder: any) => {
        (config as any).where(req, builder);
      };

      const delResult = await db(config.table)
        .where(whereCallback)
        .del();

      const finalResult = await runAfter({ success: true, deletedCount: delResult }, req);

      res.json(finalResult);
    } catch (error) {
      next(error);
    }
  };
}
