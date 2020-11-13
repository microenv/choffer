const _ = require("lodash");
const Axios = require("axios");

function HttpProxyService(config) {
  this.context = null;
  this.config = _.merge(
    {},
    {
      name: "",
      prefix: "",
      destination: "",
      middlewares: [],
      axiosConfig: {},
      // whitelist_paths: [],
      // blacklist_paths: [],
    },
    config
  );
}

HttpProxyService.prototype._getAxiosConfig = function () {
  return _.merge({}, this.config.axiosConfig, {
    baseURL: this.config.destination,
  });
};

HttpProxyService.prototype._registerService = function (context) {
  this.context = context;
  this.context.app.use(this.config.prefix, async (req, res, next) => {
    try {
      const path = req.originalUrl.replace(this.config.prefix, "");
      let proxyRes;

      if (["GET", "DELETE"].indexOf(req.method) > -1) {
        proxyRes = await Axios[req.method.toLowerCase()](
          path,
          this._getAxiosConfig()
        );
      } else {
        proxyRes = await Axios[req.method.toLowerCase()](
          path,
          req.body,
          this._getAxiosConfig()
        );
      }

      let isJson = typeof proxyRes.data === "object";

      if (isJson) {
        res.status(proxyRes.status).json(proxyRes.data);
      } else {
        res.status(proxyRes.status).send(proxyRes.data);
      }
    } catch (error) {
      next(error);
    }
  });
};

module.exports = (config) => new HttpProxyService(config);
