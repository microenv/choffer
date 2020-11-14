import * as _ from "lodash";
import express, { Request, Response, NextFunction } from "express";
import ServerError from "../../Errors/ServerError";
import { RestMiddleware, RestServiceBase, RestServiceContext } from "..";

export type RestServiceConfig = {
  name: string;
  description: string;
  prefix: string;
  middlewares: RestMiddleware[];
};

export type RestEndpoint = {
  name?: string;
  description?: string;
  method: string;
  uri: string;
  middlewares: RestMiddleware[];
  handler?: Function;
};

const defaultServiceConfig: RestServiceConfig = {
  name: '',
  description: '',
  prefix: '',
  middlewares: [],
};

const defaultEndpointConfig: RestEndpoint = {
  name: '',
  description: '',
  method: '',
  uri: '',
  middlewares: [],
  handler: undefined,
};

class RestService implements RestServiceBase {
  context?: RestServiceContext;
  config: RestServiceConfig;
  endpoints: RestEndpoint[] = [];
  router = express.Router();

  constructor(config: Partial<RestServiceConfig>) {
    this.config = _.merge({}, defaultServiceConfig, config);

    console.log('[Choffer] Service: ', this.config.prefix, ` - ${this.config.name}`);

    this.config.middlewares.map((mid: RestMiddleware) => {
      this.router.use(mid as any);
    });
  }

  addEndpoint(endpoint: RestEndpoint) {
    this.endpoints.push(_.merge({}, defaultEndpointConfig, endpoint));
  }

  registerService(context: RestServiceContext) {
    this.context = context;

    this.endpoints.map((endp) => {
      let method = "undefined-method";
      switch (endp.method) {
        case "GET":
          method = "get";
          break;
        case "POST":
          method = "post";
          break;
        case "PUT":
          method = "put";
          break;
        case "PATCH":
          method = "patch";
          break;
        case "DEL":
        case "DELETE":
          method = "delete";
          break;
        default:
          throw new ServerError(`Unknown method: ${endp.method}`);
      }

      const uri = `${endp.uri}`;
      const args: any[] = [uri];
      endp.middlewares.map((mid: RestMiddleware) => {
        args.push(mid as any);
      });
      args.push(async (req: Request, res: Response, next: NextFunction) => {
        try {
          if (endp.handler) {
            const handler = endp.handler as RestMiddleware;
            await handler(req, res, next);
          }
        } catch (error) {
          next(error);
        }
      });
      (this.router as any)[method](...args);
      console.log("[Choffer] - Endpoint: ", `${method} ${uri}`);
    });

    this.context.app.use(this.config.prefix, this.router);
  }
}

export default (config: Partial<RestServiceConfig>) => new RestService(config);
