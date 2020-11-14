const Choffer = require("../src");

const service = Choffer.HttpProxyService({
  name: "choffer-docs",
  prefix: "/docs",
  destination: "https://www.prisma.io/",
  middlewares: [],
  axiosConfig: {
    headers: {
      Accept: "*/*",
    },
  },
});

module.exports = service;
