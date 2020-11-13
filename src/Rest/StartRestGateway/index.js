const _ = require("lodash");
const express = require("express");
const cors = require("cors");
const ServerError = require("../../Errors/ServerError");

const defaultGatewayConfig = require("./defaultGatewayConfig");

let alreadyStarted = false;

function StartRestGateway(gatewayConfig) {
  if (alreadyStarted) {
    throw new ServerError(
      "Ambiguous Gateway: There's already a REST Gateway running...",
      "error_ambiguous_rest_gateway"
    );
  }

  alreadyStarted = true;

  this.config = _.merge({}, defaultGatewayConfig, gatewayConfig);

  this._configureExpressServer();
  this._registerServices();
  this._listenExpressServer();
}

StartRestGateway.prototype._configureExpressServer = function () {
  this.app = express();
  this.app.use(cors());
  this.app.set("json spaces", 2);

  this.config.middlewares.map((mid) => {
    console.log("MIDDLEWARE =========== ", mid);
    this.app.use(mid);
  });
};

StartRestGateway.prototype._listenExpressServer = function () {
  this.app.listen(this.config.config.port, () => {
    console.log(
      `${this.config.config.name || "Your api"} is listening on port ${
        this.config.config.port
      }`
    );
  });
};

StartRestGateway.prototype._registerServices = function () {
  this.services = [];
  this.config.services.map((service) => {
    service._registerService(this);
  });
};

module.exports = (gatewayConfig) => new StartRestGateway(gatewayConfig);
