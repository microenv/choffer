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
  onBeforeDelete?: () => any;
  onAfterDelete?: (result: DeletedResponse) => any;
}

export default function KnexDelete(config: KnexDeleteConfig) {
  const runBefore = async () => {
    if (config.onBeforeDelete) {
      return await config.onBeforeDelete();
    }
  }

  const runAfter = async (result: DeletedResponse) => {
    if (config.onAfterDelete) {
      return await config.onAfterDelete(result);
    }

    return result;
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await runBefore();

      const db = Databases.Database(config.connection);

      const whereCallback = (builder: any) => {
        (config as any).where(req, builder);
      };

      const delResult = await db(config.table)
        .where(whereCallback)
        .del();

      const finalResult = await runAfter({ success: true, deletedCount: delResult });

      res.json(finalResult);
    } catch (error) {
      next(error);
    }
  };
}
