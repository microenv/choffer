import * as _ from 'lodash';
import Axios, { AxiosRequestConfig } from 'axios';
import { Request, Response, NextFunction } from 'express';
import { RestServiceBase, RestServiceContext } from '..';

export type HttpProxyConfig = {
  name: string;
  prefix: string;
  destination: string;
  middlewares: Function[];
  axiosConfig: AxiosRequestConfig;
}

class HttpProxyService implements RestServiceBase {
  context?: RestServiceContext;
  config: HttpProxyConfig;

  constructor(config: Partial<HttpProxyConfig> = {}) {
    this.config = _.merge(
      {},
      {
        name: '',
        prefix: '',
        destination: '',
        middlewares: [],
        axiosConfig: {},
      },
      config
    );
  }

  private getAxiosConfig() {
    return _.merge({}, this.config.axiosConfig, {
      baseURL: this.config.destination,
    });
  };

  registerService(context: RestServiceContext) {
    this.context = context;
    const args: any = [];
    args.push(this.config.prefix);
    this.config.middlewares.map(mid => {
      args.push(mid);
    });

    this.context.app.use(
      ...args,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const path = req.originalUrl.replace(this.config.prefix, '');
          let proxyRes;

          const fn = (Axios as any)[req.method.toLowerCase()] as Function;

          if (['GET', 'DELETE'].indexOf(req.method) > -1) {
            proxyRes = await fn(
              path,
              this.getAxiosConfig()
            );
          } else {
            proxyRes = await fn(
              path,
              req.body,
              this.getAxiosConfig()
            );
          }

          const content = proxyRes.data;
          let isJson = typeof proxyRes.data === 'object';

          if (isJson) {
            res.status(proxyRes.status).json(content);
          } else {
            res.status(proxyRes.status).send(content);
          }
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

export default (config: Partial<HttpProxyConfig>) => new HttpProxyService(config);
