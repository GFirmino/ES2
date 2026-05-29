const TemperatureGatewayStub = require("../src/gateways/stubs/TemperatureGatewayStub");
const NotificationGatewayMock = require("../src/gateways/mocks/NotificationGatewayMock");
const {
  collectAutomaticTemperatureMeasurement
} = require("../src/services/automaticTemperatureMeasurement.service");

const plan = {
  temperatureMin: 18,
  temperatureMax: 28,
  humidityMin: 40,
  humidityMax: 80,
  luminosityMin: 5000,
  luminosityMax: 25000
};

function createInput() {
  return {
    sensorId: "sensor-1",
    batchId: 1,
    plan
  };
}

describe("Fluxo temperatura-alerta-notificacao sem HTTP - Sprint 6", () => {
  test("TD-FLOW-01: leitura fora dos limites passa pelo classificador e chama notificationGateway", async () => {
    const notificationGateway = new NotificationGatewayMock();
    const temperatureGateway = new TemperatureGatewayStub([
      { sensorId: "sensor-1", temperature: 29, sensorOK: true }
    ]);

    const result = await collectAutomaticTemperatureMeasurement(createInput(), {
      temperatureGateway,
      notificationGateway
    });

    expect(result.alert).toMatchObject({
      classification: "INFORMATIVO",
      reasons: ["temperatura acima do maximo"]
    });
    expect(notificationGateway.getCallCount()).toBe(1);
    expect(notificationGateway.getLastNotification().payload).toMatchObject({
      batchId: 1,
      sensorId: "sensor-1",
      temperature: 29
    });
  });

  test("TD-FLOW-02: leitura dentro dos limites nao chama notificationGateway", async () => {
    const notificationGateway = new NotificationGatewayMock();
    const temperatureGateway = new TemperatureGatewayStub([
      { sensorId: "sensor-1", temperature: 23, sensorOK: true }
    ]);

    const result = await collectAutomaticTemperatureMeasurement(createInput(), {
      temperatureGateway,
      notificationGateway
    });

    expect(result.alert).toBeNull();
    expect(notificationGateway.getCallCount()).toBe(0);
  });
});
