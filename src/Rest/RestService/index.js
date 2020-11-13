const _ = require("lodash");
const defaultServiceConfig = require("./defaultServiceConfig");
const defaultEndpointConfig = require("./defaultEndpointConfig");
const ServerError = require("../../Errors/ServerError");

function RestService(config) {
  this.context = null;
  this.config = _.merge({}, defaultServiceConfig, config);
  this.endpoints = [];
}

RestService.prototype.addEndpoint = function (endConfig) {
  this.endpoints.push(_.merge({}, defaultEndpointConfig, endConfig));
};

RestService.prototype._registerService = function (context) {
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

    const uri = `${this.config.prefix}${endp.uri}`;
    const args = [uri];
    endp.middlewares.map((mid) => {
      args.push(mid);
    });
    args.push(endp.handler);
    this.context.app[method](...args);
    console.log("[Choffer] Endpoint: ", `${method} ${uri}`);
  });
};

module.exports = (config) => new RestService(config);
