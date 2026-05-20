const { validateMeasurement } = require("../src/services/measurements.service");

function validMeasurement(overrides = {}) {
  return {
    batchId: 1,
    temperature: 23,
    humidity: 50,
    luminosity: 15000,
    measuredAt: "2026-01-01T10:00:00.000Z",
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

describe("Measurements service", () => {
  test("TU-MEAS-01: medicao valida e aceite", () => {
    const measurement = validateMeasurement(validMeasurement());

    expect(measurement).toMatchObject({
      batchId: 1,
      temperature: 23,
      humidity: 50,
      luminosity: 15000,
      sensorOK: true
    });
  });

  test("TU-MEAS-02: temperature em falta devolve erro 400", () => {
    const { temperature, ...payload } = validMeasurement();

    expectControlledError(() => validateMeasurement(payload), 400);
  });

  test("TU-MEAS-03: temperature nao numerica devolve erro 400", () => {
    expectControlledError(() => validateMeasurement(validMeasurement({ temperature: "vinte" })), 400);
  });

  test("TU-MEAS-04: humidity abaixo de 0 devolve erro 400 e limite 0 e aceite", () => {
    expectControlledError(() => validateMeasurement(validMeasurement({ humidity: -1 })), 400);
    expect(validateMeasurement(validMeasurement({ humidity: 0 })).humidity).toBe(0);
  });

  test("TU-MEAS-05: humidity acima de 100 devolve erro 400 e limite 100 e aceite", () => {
    expect(validateMeasurement(validMeasurement({ humidity: 100 })).humidity).toBe(100);
    expectControlledError(() => validateMeasurement(validMeasurement({ humidity: 101 })), 400);
  });

  test("TU-MEAS-06: luminosity negativa devolve erro 400", () => {
    expectControlledError(() => validateMeasurement(validMeasurement({ luminosity: -1 })), 400);
  });

  test("TU-MEAS-07: measuredAt invalido devolve erro 400", () => {
    expectControlledError(() => validateMeasurement(validMeasurement({ measuredAt: "data-invalida" })), 400);
  });

  test("TU-MEAS-08: sensorOK nao booleano devolve erro 400", () => {
    expectControlledError(() => validateMeasurement(validMeasurement({ sensorOK: "true" })), 400);
  });
});
