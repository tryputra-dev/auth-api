const HealthsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'healths',
  register: async (server, { container }) => {
    const healthsHandler = new HealthsHandler(container);
    server.route(routes(healthsHandler));
  },
};
