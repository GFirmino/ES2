const AppError = require("../../errors/AppError");
const TemperatureGateway = require("../TemperatureGateway");

class TemperatureGatewayStub extends TemperatureGateway {
  constructor(readings = []) {
    super();
    this.readings = readings.map((reading) => ({ ...reading }));
    this.calls = [];
  }

  async getCurrentTemperature(sensorId) {
    this.calls.push(sensorId);

    const readingIndex = this.readings.findIndex(
      (reading) => !reading.sensorId || reading.sensorId === sensorId
    );

    if (readingIndex === -1) {
      throw new AppError("Leitura de temperatura nao encontrada.", 404, { sensorId });
    }

    const [reading] = this.readings.splice(readingIndex, 1);

    if (reading.error) {
      if (reading.error instanceof Error) {
        throw reading.error;
      }

      throw new AppError(
        String(reading.error),
        reading.statusCode || 500,
        reading.details || { sensorId }
      );
    }

    return {
      sensorId: reading.sensorId || sensorId,
      temperature: reading.temperature,
      sensorOK: reading.sensorOK !== undefined ? reading.sensorOK : true,
      measuredAt: reading.measuredAt || new Date().toISOString()
    };
  }

  getCallCount() {
    return this.calls.length;
  }

  getCalls() {
    return [...this.calls];
  }
}

module.exports = TemperatureGatewayStub;
