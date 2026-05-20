const { authorizeRole } = require("../src/services/accessControl.service");

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

describe("Access control service", () => {
  test("TU-ACCESS-01: ADMIN acede a operacao apenas de ADMIN", () => {
    const result = authorizeRole({ id: 3, role: "ADMIN" }, ["ADMIN"]);

    expect(result.authorized).toBe(true);
    expect(result.role).toBe("ADMIN");
  });

  test("TU-ACCESS-02: TECNICO tenta operacao apenas de ADMIN e recebe erro 403", () => {
    expectControlledError(() => authorizeRole({ id: 1, role: "TECNICO" }, ["ADMIN"]), 403);
  });

  test("TU-ACCESS-03: RESPONSAVEL tenta operacao apenas de ADMIN e recebe erro 403", () => {
    expectControlledError(() => authorizeRole({ id: 2, role: "RESPONSAVEL" }, ["ADMIN"]), 403);
  });

  test("TU-ACCESS-04: utilizador ausente recebe erro 401", () => {
    expectControlledError(() => authorizeRole(null, ["ADMIN"]), 401);
  });

  test("TU-ACCESS-05: role desconhecida recebe erro 403", () => {
    expectControlledError(() => authorizeRole({ id: 4, role: "GESTOR" }, ["ADMIN"]), 403);
  });

  test("TU-ACCESS-06: RESPONSAVEL acede a operacao permitida a RESPONSAVEL e ADMIN", () => {
    const result = authorizeRole({ id: 2, role: "RESPONSAVEL" }, ["RESPONSAVEL", "ADMIN"]);

    expect(result.authorized).toBe(true);
    expect(result.role).toBe("RESPONSAVEL");
  });
});
