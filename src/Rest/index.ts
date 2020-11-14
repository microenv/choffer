import { Express } from 'express';

export { default as Middlewares } from './Middlewares';

export type RestServiceContext = {
  app: Express;
};

export interface RestServiceBase {
  context?: RestServiceContext;
  registerService: (context: RestServiceContext) => void;
}

export type RestMiddleware = Function;
