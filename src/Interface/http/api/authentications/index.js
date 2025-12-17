const routes = require("./routes");
const AuthenticationsHandler = require("./handler");
const Jwt = require("@hapi/jwt");
const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");
const AuthenticationError = require("../../../../Commons/exceptions/AuthenticationError");

module.exports = {
  name: "authentications",
  register: async (server, { container }) => {
    const authenticationsHandler = new AuthenticationsHandler(container);
    server.route(routes(authenticationsHandler));
  },
};
