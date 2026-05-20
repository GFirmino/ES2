const { decideAutomationAction } = require("../src/services/automation.service");

function validAutomationInput(overrides = {}) {
  return {
    mode: "AUTOMATICO",
    ruleActive: true,
    measurementRecent: true,
    breachDetected: true,
    suggestedAction: "REGAR",
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

describe("Automation service", () => {
  test("TU-AUTO-01: MANUAL com condicoes operacionais sugere acao", () => {
    const result = decideAutomationAction(validAutomationInput({ mode: "MANUAL" }));

    expect(result.decision).toBe("SUGGEST_ACTION");
    expect(result.action).toBe("REGAR");
  });

  test("TU-AUTO-02: AUTOMATICO com condicoes operacionais executa acao", () => {
    const result = decideAutomationAction(validAutomationInput());

    expect(result.decision).toBe("EXECUTE_ACTION");
  });

  test("TU-AUTO-03: AUTOMATICO com regra inativa nao executa acao", () => {
    const result = decideAutomationAction(validAutomationInput({ ruleActive: false }));

    expect(result.decision).toBe("NO_ACTION");
  });

  test("TU-AUTO-04: AUTOMATICO com medicao nao recente nao executa acao", () => {
    const result = decideAutomationAction(validAutomationInput({ measurementRecent: false }));

    expect(result.decision).toBe("NO_ACTION");
  });

  test("TU-AUTO-05: AUTOMATICO sem violacao nao executa acao", () => {
    const result = decideAutomationAction(validAutomationInput({ breachDetected: false }));

    expect(result.decision).toBe("NO_ACTION");
  });

  test("TU-AUTO-06: modo invalido devolve erro 400", () => {
    expectControlledError(() => decideAutomationAction(validAutomationInput({ mode: "AUTO" })), 400);
  });

  test("TU-AUTO-07: ruleActive com tipo invalido devolve erro 400", () => {
    expectControlledError(() => decideAutomationAction(validAutomationInput({ ruleActive: "sim" })), 400);
  });
});
