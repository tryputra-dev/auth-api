const routes = (handler) => [
  {
    method: "GET",
    path: "/",
    handler: handler.getHealthHandler,
  }
];

module.exports = routes;
