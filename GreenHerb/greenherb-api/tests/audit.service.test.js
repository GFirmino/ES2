const { createAuditEntry, shouldAuditOperation } = require("../src/services/audit.service");

function validAuditInput(overrides = {}) {
  return {
    userId: 1,
    action: "CREATE_PLAN",
    resource: "plans",
    resourceId: 10,
    timestamp: "2026-01-01T10:00:00.000Z",
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

describe("Audit service", () => {
  test("TU-AUDIT-01: cria entrada valida", () => {
    const entry = createAuditEntry(validAuditInput());

    expect(entry).toMatchObject({
      userId: 1,
      action: "CREATE_PLAN",
      resource: "plans",
      resourceId: 10,
      timestamp: "2026-01-01T10:00:00.000Z"
    });
  });

  test("TU-AUDIT-02: cria entrada sem timestamp gerando timestamp automaticamente", () => {
    const { timestamp, ...payload } = validAuditInput();
    const entry = createAuditEntry(payload);

    expect(entry.timestamp).toBeDefined();
    expect(Number.isNaN(new Date(entry.timestamp).getTime())).toBe(false);
  });

  test("TU-AUDIT-03: criar entrada sem userId devolve erro 400", () => {
    const { userId, ...payload } = validAuditInput();

    expectControlledError(() => createAuditEntry(payload), 400);
  });

  test("TU-AUDIT-04: criar entrada sem action devolve erro 400", () => {
    const { action, ...payload } = validAuditInput();

    expectControlledError(() => createAuditEntry(payload), 400);
  });

  test("TU-AUDIT-05: criar entrada sem resource devolve erro 400", () => {
    const { resource, ...payload } = validAuditInput();

    expectControlledError(() => createAuditEntry(payload), 400);
  });

  test("TU-AUDIT-06: verifica operacoes auditaveis", () => {
    expect(shouldAuditOperation("POST")).toBe(true);
    expect(shouldAuditOperation("PUT")).toBe(true);
    expect(shouldAuditOperation("PATCH")).toBe(true);
    expect(shouldAuditOperation("DELETE")).toBe(true);
    expect(shouldAuditOperation("GET")).toBe(false);
  });
});
