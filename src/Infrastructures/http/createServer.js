const Hapi = require("@hapi/hapi");
const ClientError = require("../../Commons/exceptions/ClientError");
const DomainErrorTranslator = require("../../Commons/exceptions/DomainErrorTranslator");
const users = require("../../Interface/http/api/users");
const authentications = require("../../Interface/http/api/authentications");
const comments = require("../../Interface/http/api/comments");
const threads = require("../../Interface/http/api/threads");
const Jwt = require("@hapi/jwt");

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([{ plugin: Jwt }]);

  server.auth.strategy("auth_token", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    validate: (artifacts) => {
      const { id } = artifacts.decoded.payload;

      if (!id) {
        return { isValid: false };
      }

      return {
        isValid: true,
        credentials: {
          id: id,
        },
      };
    },
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response.isBoom && response.output.statusCode === 401) {
      const newResponse = h.response({
        status: "fail",
        message: "Missing authentication",
      });
      newResponse.code(401);
      return newResponse;
    }

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: "error",
        message: response.message,
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
