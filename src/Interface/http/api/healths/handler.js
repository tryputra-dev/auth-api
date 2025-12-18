class HealthsHandler {
  constructor() {
    this.getHealthHandler = this.getHealthHandler.bind(this);
  }

  getHealthHandler() {
    return {
      status: 'ok',
      message: 'Server is healthy',
      version: '1.0.5',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = HealthsHandler;