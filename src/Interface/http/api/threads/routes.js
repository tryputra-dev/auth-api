const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "auth_token",
    },
  },

  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadDetailHandler,
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
