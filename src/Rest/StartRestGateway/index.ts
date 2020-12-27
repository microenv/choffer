import * as _ from 'lodash';
import ServerError from '../../Errors/ServerError';
import { RestMiddleware, RestServiceBase, RestServiceContext } from '..';

const express = require('express');
const cors = require('cors');

export type RestGatewayConfig = {
  config: {
    name: string;
    port: number;
  };
  middlewares: RestMiddleware[],
  services: RestServiceBase[],
}

const defaultGatewayConfig = {
  config: {
    name: '',
    port: 8080,
  },
  middlewares: [],
  services: [],
};


let alreadyStarted: boolean = false;

class StartRestGateway implements RestServiceContext {
  config: RestGatewayConfig;
  app = express();

  constructor(gatewayConfig: Partial<RestGatewayConfig>) {
    if (alreadyStarted) {
      throw new ServerError(
        "Ambiguous Gateway: There's already a REST Gateway running...",
        'error_ambiguous_rest_gateway'
      );
    }

    alreadyStarted = true;

    this.config = _.merge({}, defaultGatewayConfig, gatewayConfig);

    this.configureExpressServer();
    this.registerServices();
    this.listenExpressServer();
  }

  private configureExpressServer() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.set('json spaces', 2);

    this.config.middlewares.map((mid: RestMiddleware) => {
      this.app.use(mid as any);
    });
  }

  private listenExpressServer() {
    this.app.listen(this.config.config.port, () => {
      console.log(
        `${this.config.config.name || 'Your api'} is listening on port ${
        this.config.config.port
        }`
      );
    });
  }

  private registerServices() {
    this.config.services.map((service: RestServiceBase) => {
      service.registerService(this);
    });
  }
}

export default (gatewayConfig: Partial<RestGatewayConfig>) => new StartRestGateway(gatewayConfig);
