const {
  validateBatchTransition,
  calculateBatchProductivity
} = require("../src/services/batches.service");

function activeBatch(overrides = {}) {
  return {
    id: 1,
    state: "ATIVO",
    expectedUnits: 100,
    harvestedUnits: 90,
    lostUnits: 0,
    dividedUnits: 0,
    ...overrides
  };
}

function concludedBatch(overrides = {}) {
  return {
    ...activeBatch(),
    state: "CONCLUIDO",
    actualEndDate: "2026-01-01T10:00:00.000Z",
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

describe("Batches service", () => {
  test("TU-BATCH-01: transicao ATIVO para CONCLUIDO com actualEndDate e aceite", () => {
    const batch = validateBatchTransition(activeBatch(), "CONCLUIDO", {
      actualEndDate: "2026-01-01T10:00:00.000Z"
    });

    expect(batch.state).toBe("CONCLUIDO");
    expect(batch.actualEndDate).toBe("2026-01-01T10:00:00.000Z");
  });

  test("TU-BATCH-02: transicao ATIVO para CONCLUIDO sem actualEndDate devolve erro 400", () => {
    expectControlledError(() => validateBatchTransition(activeBatch(), "CONCLUIDO"), 400);
  });

  test("TU-BATCH-03: transicao ATIVO para COMPROMETIDO com perdas registadas e aceite", () => {
    const batch = validateBatchTransition(activeBatch({ lostUnits: 5 }), "COMPROMETIDO");

    expect(batch.state).toBe("COMPROMETIDO");
  });

  test("TU-BATCH-04: transicao ATIVO para COMPROMETIDO com alerta critico aberto e aceite", () => {
    const batch = validateBatchTransition(activeBatch(), "COMPROMETIDO", {
      hasOpenCriticalAlert: true
    });

    expect(batch.state).toBe("COMPROMETIDO");
  });

  test("TU-BATCH-05: transicao CONCLUIDO para ATIVO devolve erro 409", () => {
    expectControlledError(() => validateBatchTransition(concludedBatch(), "ATIVO"), 409);
  });

  test("TU-BATCH-06: transicao COMPROMETIDO para ATIVO devolve erro 409", () => {
    expectControlledError(() => validateBatchTransition(activeBatch({ state: "COMPROMETIDO" }), "ATIVO"), 409);
  });

  test("TU-BATCH-07: estado alvo invalido devolve erro 400", () => {
    expectControlledError(() => validateBatchTransition(activeBatch(), "SUSPENSO"), 400);
  });

  test("TU-BATCH-08: produtividade sem perdas devolve 100 por cento", () => {
    const result = calculateBatchProductivity(
      concludedBatch({ expectedUnits: 100, harvestedUnits: 100, lostUnits: 0, dividedUnits: 0 })
    );

    expect(result.productivityPercentage).toBe(100);
  });

  test("TU-BATCH-09: produtividade com perdas devolve 80 por cento", () => {
    const result = calculateBatchProductivity(
      concludedBatch({ expectedUnits: 100, harvestedUnits: 90, lostUnits: 10, dividedUnits: 0 })
    );

    expect(result.productivityPercentage).toBe(80);
  });

  test("TU-BATCH-10: produtividade com divisao devolve 95 por cento", () => {
    const result = calculateBatchProductivity(
      concludedBatch({ expectedUnits: 100, harvestedUnits: 80, lostUnits: 5, dividedUnits: 20 })
    );

    expect(result.productivityPercentage).toBe(95);
  });

  test("TU-BATCH-11: expectedUnits igual a 0 devolve erro 400", () => {
    expectControlledError(() => calculateBatchProductivity(concludedBatch({ expectedUnits: 0 })), 400);
  });

  test("TU-BATCH-12: produtividade de lote nao concluido devolve erro 409", () => {
    expectControlledError(() => calculateBatchProductivity(activeBatch()), 409);
  });
});
