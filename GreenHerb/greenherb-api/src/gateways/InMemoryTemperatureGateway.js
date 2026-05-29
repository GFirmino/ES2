const TemperatureGateway = require("./TemperatureGateway");

class InMemoryTemperatureGateway extends TemperatureGateway {
  constructor(defaultTemperature = 23) {
    super();
    this.defaultTemperature = defaultTemperature;
  }

  async getCurrentTemperature(sensorId) {
    return {
      sensorId,
      temperature: this.defaultTemperature,
      sensorOK: true,
      measuredAt: new Date().toISOString()
    };
  }
}

module.exports = InMemoryTemperatureGateway;
