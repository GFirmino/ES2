const { decideAlert } = require("../src/services/alertDecision.service");

function openAlert(overrides = {}) {
  return {
    id: 1,
    status: "ABERTO",
    classification: "AVISO",
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

describe("Alert decision service", () => {
  test("TU-ALERTDEC-01: resolver alerta sem justificacao e aceite", () => {
    const alert = decideAlert(openAlert(), { decision: "RESOLVIDO" });

    expect(alert.status).toBe("RESOLVIDO");
    expect(alert.justification).toBeUndefined();
  });

  test("TU-ALERTDEC-02: ignorar alerta com justificacao valida e aceite", () => {
    const alert = decideAlert(openAlert(), {
      decision: "IGNORADO",
      justification: "Tratado manualmente"
    });

    expect(alert.status).toBe("IGNORADO");
    expect(alert.justification).toBe("Tratado manualmente");
  });

  test("TU-ALERTDEC-03: ignorar alerta sem justificacao devolve erro 422", () => {
    expectControlledError(() => decideAlert(openAlert(), { decision: "IGNORADO" }), 422);
  });

  test("TU-ALERTDEC-04: ignorar alerta com justificacao de 9 caracteres devolve erro 422", () => {
    expectControlledError(
      () => decideAlert(openAlert(), { decision: "IGNORADO", justification: "123456789" }),
      422
    );
  });

  test("TU-ALERTDEC-05: ignorar alerta com justificacao de 10 caracteres e aceite", () => {
    const alert = decideAlert(openAlert(), {
      decision: "IGNORADO",
      justification: "1234567890"
    });

    expect(alert.status).toBe("IGNORADO");
  });

  test("TU-ALERTDEC-06: ignorar alerta com justificacao de 250 caracteres e aceite", () => {
    const alert = decideAlert(openAlert(), {
      decision: "IGNORADO",
      justification: "a".repeat(250)
    });

    expect(alert.justification).toHaveLength(250);
  });

  test("TU-ALERTDEC-07: ignorar alerta com justificacao de 500 caracteres e aceite", () => {
    const alert = decideAlert(openAlert(), {
      decision: "IGNORADO",
      justification: "a".repeat(500)
    });

    expect(alert.justification).toHaveLength(500);
  });

  test("TU-ALERTDEC-08: ignorar alerta com justificacao de 501 caracteres devolve erro 422", () => {
    expectControlledError(
      () => decideAlert(openAlert(), { decision: "IGNORADO", justification: "a".repeat(501) }),
      422
    );
  });

  test("TU-ALERTDEC-09: decisao invalida devolve erro 400", () => {
    expectControlledError(() => decideAlert(openAlert(), { decision: "ADIADO" }), 400);
  });

  test("TU-ALERTDEC-10: alterar alerta ja resolvido devolve erro 409", () => {
    expectControlledError(
      () => decideAlert(openAlert({ status: "RESOLVIDO" }), { decision: "IGNORADO", justification: "Valido aqui" }),
      409
    );
  });
});
