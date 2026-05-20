const { classifyAlert } = require("../src/services/alerts.service");

function validPlan(overrides = {}) {
  return {
    temperatureMin: 18,
    temperatureMax: 28,
    humidityMin: 40,
    humidityMax: 80,
    luminosityMin: 5000,
    luminosityMax: 25000,
    ...overrides
  };
}

function validMeasurement(overrides = {}) {
  return {
    temperature: 23,
    humidity: 60,
    luminosity: 15000,
    sensorOK: true,
    ...overrides
  };
}

function expectControlledError(action, statusCode) {
  let caughtError;

  try {
    action();
  } catch (error) {
    caughtError = error;
  }

  expect(caughtError).toBeDefined();
  expect(caughtError.statusCode).toBe(statusCode);
}

describe("Alerts service", () => {
  test("TU-ALERT-01: medicao dentro dos limites nao gera alerta", () => {
    expect(classifyAlert(validMeasurement(), validPlan())).toBeNull();
  });

  test("TU-ALERT-02: sensorOK false com valores fora dos limites nao gera alerta", () => {
    const alert = classifyAlert(validMeasurement({ temperature: 29, sensorOK: false }), validPlan());

    expect(alert).toBeNull();
  });

  test("TU-ALERT-03: temperatura acima do maximo gera alerta INFORMATIVO", () => {
    const alert = classifyAlert(validMeasurement({ temperature: 29 }), validPlan());

    expect(alert.classification).toBe("INFORMATIVO");
    expect(alert.reasons).toHaveLength(1);
  });

  test("TU-ALERT-04: humidade abaixo do minimo gera alerta INFORMATIVO", () => {
    const alert = classifyAlert(validMeasurement({ humidity: 39 }), validPlan());

    expect(alert.classification).toBe("INFORMATIVO");
    expect(alert.reasons).toHaveLength(1);
  });

  test("TU-ALERT-05: luminosidade abaixo do minimo gera alerta INFORMATIVO", () => {
    const alert = classifyAlert(validMeasurement({ luminosity: 4999 }), validPlan());

    expect(alert.classification).toBe("INFORMATIVO");
    expect(alert.reasons).toHaveLength(1);
  });

  test("TU-ALERT-06: duas violacoes simultaneas geram alerta AVISO", () => {
    const alert = classifyAlert(validMeasurement({ temperature: 29, humidity: 39 }), validPlan());

    expect(alert.classification).toBe("AVISO");
    expect(alert.reasons).toHaveLength(2);
  });

  test("TU-ALERT-07: tres violacoes simultaneas geram alerta CRITICO", () => {
    const alert = classifyAlert(
      validMeasurement({ temperature: 29, humidity: 39, luminosity: 4999 }),
      validPlan()
    );

    expect(alert.classification).toBe("CRITICO");
    expect(alert.reasons).toHaveLength(3);
  });

  test("TU-ALERT-08: plano sem limites obrigatorios devolve erro 400", () => {
    expectControlledError(() => classifyAlert(validMeasurement(), { temperatureMin: 18 }), 400);
  });

  test("TU-ALERT-09: temperature no limite superior nao gera alerta", () => {
    expect(classifyAlert(validMeasurement({ temperature: 28 }), validPlan())).toBeNull();
  });
});
