const TemperatureGatewayStub = require("../src/gateways/stubs/TemperatureGatewayStub");

describe("TemperatureGatewayStub - Sprint 6", () => {
  test("TD-TEMP-01: stub devolve temperatura configurada", async () => {
    const stub = new TemperatureGatewayStub([
      { sensorId: "sensor-1", temperature: 23, sensorOK: true }
    ]);

    const reading = await stub.getCurrentTemperature("sensor-1");

    expect(reading.temperature).toBe(23);
    expect(reading.sensorOK).toBe(true);
  });

  test("TD-TEMP-02: stub devolve leituras sequenciais", async () => {
    const stub = new TemperatureGatewayStub([
      { sensorId: "sensor-1", temperature: 23, sensorOK: true },
      { sensorId: "sensor-1", temperature: 29, sensorOK: true }
    ]);

    const firstReading = await stub.getCurrentTemperature("sensor-1");
    const secondReading = await stub.getCurrentTemperature("sensor-1");

    expect(firstReading.temperature).toBe(23);
    expect(secondReading.temperature).toBe(29);
  });

  test("TD-TEMP-03: stub simula sensor invalido", async () => {
    const stub = new TemperatureGatewayStub([
      { sensorId: "sensor-1", temperature: 23, sensorOK: false }
    ]);

    const reading = await stub.getCurrentTemperature("sensor-1");

    expect(reading.sensorOK).toBe(false);
  });

  test("TD-TEMP-04: stub simula ausencia de leitura", async () => {
    const stub = new TemperatureGatewayStub([]);

    await expect(stub.getCurrentTemperature("sensor-1")).rejects.toMatchObject({
      statusCode: 404
    });
  });

  test("TD-TEMP-05: stub nao chama gateway externo real", async () => {
    const stub = new TemperatureGatewayStub([
      { sensorId: "sensor-1", temperature: 23, sensorOK: true }
    ]);

    await stub.getCurrentTemperature("sensor-1");

    expect(stub).toBeInstanceOf(TemperatureGatewayStub);
    expect(stub.getCallCount()).toBe(1);
    expect(stub.getCalls()).toEqual(["sensor-1"]);
  });
});
