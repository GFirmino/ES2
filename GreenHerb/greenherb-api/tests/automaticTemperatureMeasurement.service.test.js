const TemperatureGatewayStub = require("../src/gateways/stubs/TemperatureGatewayStub");
const NotificationGatewayMock = require("../src/gateways/mocks/NotificationGatewayMock");
const {
  collectAutomaticTemperatureMeasurement
} = require("../src/services/automaticTemperatureMeasurement.service");

function createPlan() {
  return {
    temperatureMin: 18,
    temperatureMax: 28,
    humidityMin: 40,
    humidityMax: 80,
    luminosityMin: 5000,
    luminosityMax: 25000
  };
}

function createInput(overrides = {}) {
  return {
    sensorId: "sensor-1",
    batchId: 1,
    plan: createPlan(),
    ...overrides
  };
}

function createDependencies(readings) {
  return {
    temperatureGateway: new TemperatureGatewayStub(readings),
    notificationGateway: new NotificationGatewayMock()
  };
}

describe("collectAutomaticTemperatureMeasurement - Sprint 6", () => {
  test("TD-AUTOTEMP-01: temperatura dentro dos limites nao gera alerta nem notificacao", async () => {
    const dependencies = createDependencies([
      { sensorId: "sensor-1", temperature: 23, sensorOK: true }
    ]);

    const result = await collectAutomaticTemperatureMeasurement(createInput(), dependencies);

    expect(result.measurement.temperature).toBe(23);
    expect(result.alert).toBeNull();
    expect(result.notificationSent).toBe(false);
    expect(dependencies.notificationGateway.getCallCount()).toBe(0);
  });

  test("TD-AUTOTEMP-02: temperatura acima do limite gera alerta e notificacao", async () => {
    const dependencies = createDependencies([
      { sensorId: "sensor-1", temperature: 29, sensorOK: true }
    ]);

    const result = await collectAutomaticTemperatureMeasurement(createInput(), dependencies);
    const notification = dependencies.notificationGateway.getLastNotification();

    expect(result.measurement.temperature).toBe(29);
    expect(result.alert).toMatchObject({ classification: "INFORMATIVO" });
    expect(result.notificationSent).toBe(true);
    expect(dependencies.notificationGateway.getCallCount()).toBe(1);
    expect(notification.type).toBe("TEMPERATURE_ALERT");
    expect(notification.payload.temperature).toBe(29);
    expect(notification.payload.batchId).toBe(1);
  });

  test("TD-AUTOTEMP-03: temperatura abaixo do limite gera alerta e notificacao", async () => {
    const dependencies = createDependencies([
      { sensorId: "sensor-1", temperature: 17, sensorOK: true }
    ]);

    const result = await collectAutomaticTemperatureMeasurement(createInput(), dependencies);

    expect(result.alert).toMatchObject({ classification: "INFORMATIVO" });
    expect(result.alert.reasons).toContain("temperatura abaixo do minimo");
    expect(dependencies.notificationGateway.getCallCount()).toBe(1);
  });

  test("TD-AUTOTEMP-04: sensor invalido nao gera alerta operacional nem notificacao", async () => {
    const dependencies = createDependencies([
      { sensorId: "sensor-1", temperature: 29, sensorOK: false }
    ]);

    const result = await collectAutomaticTemperatureMeasurement(createInput(), dependencies);

    expect(result.measurement.valid).toBe(false);
    expect(result.alert).toBeNull();
    expect(result.notificationSent).toBe(false);
    expect(dependencies.notificationGateway.getCallCount()).toBe(0);
  });

  test("TD-AUTOTEMP-05: ausencia de leitura devolve erro controlado", async () => {
    const dependencies = createDependencies([]);

    await expect(collectAutomaticTemperatureMeasurement(createInput(), dependencies)).rejects.toMatchObject({
      statusCode: 404
    });
    expect(dependencies.notificationGateway.getCallCount()).toBe(0);
  });

  test("TD-AUTOTEMP-06: temperatura no limite inferior e aceite sem notificacao", async () => {
    const dependencies = createDependencies([
      { sensorId: "sensor-1", temperature: 18, sensorOK: true }
    ]);

    const result = await collectAutomaticTemperatureMeasurement(createInput(), dependencies);

    expect(result.alert).toBeNull();
    expect(result.notificationSent).toBe(false);
    expect(dependencies.notificationGateway.getCallCount()).toBe(0);
  });

  test("TD-AUTOTEMP-07: temperatura no limite superior e aceite sem notificacao", async () => {
    const dependencies = createDependencies([
      { sensorId: "sensor-1", temperature: 28, sensorOK: true }
    ]);

    const result = await collectAutomaticTemperatureMeasurement(createInput(), dependencies);

    expect(result.alert).toBeNull();
    expect(result.notificationSent).toBe(false);
    expect(dependencies.notificationGateway.getCallCount()).toBe(0);
  });

  test("TD-AUTOTEMP-08: gateway de temperatura em falta gera erro controlado", async () => {
    const notificationGateway = new NotificationGatewayMock();

    await expect(
      collectAutomaticTemperatureMeasurement(createInput(), { notificationGateway })
    ).rejects.toMatchObject({
      statusCode: 400
    });
    expect(notificationGateway.getCallCount()).toBe(0);
  });

  test("TD-AUTOTEMP-09: gateway de notificacao e chamado apenas quando existe alerta", async () => {
    const dependencies = createDependencies([
      { sensorId: "sensor-1", temperature: 23, sensorOK: true },
      { sensorId: "sensor-1", temperature: 29, sensorOK: true }
    ]);

    const firstResult = await collectAutomaticTemperatureMeasurement(createInput(), dependencies);
    const secondResult = await collectAutomaticTemperatureMeasurement(createInput(), dependencies);

    expect(firstResult.alert).toBeNull();
    expect(secondResult.alert).not.toBeNull();
    expect(dependencies.notificationGateway.getCallCount()).toBe(1);
  });
});
