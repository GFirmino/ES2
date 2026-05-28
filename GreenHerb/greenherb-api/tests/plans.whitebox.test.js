const { createPlan } = require("../src/services/plans.service");

function validPlan(overrides = {}) {
  return {
    type: "REGULAR",
    herbId: 1,
    temperature: 23,
    humidity: 60,
    luminosity: 15000,
    cycleDurationDays: 90,
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

describe("Plans service - white-box coverage", () => {
  test("WB-PLAN-01: cobre caminho type ausente", () => {
    const { type, ...input } = validPlan();

    expectControlledError(() => createPlan(input), 400);
  });

  test("WB-PLAN-02: cobre caminho type existente mas invalido", () => {
    expectControlledError(() => createPlan(validPlan({ type: "SEMANAL" })), 400);
  });

  test("WB-PLAN-03: cobre caminho type valido e continua validacao", () => {
    const plan = createPlan(validPlan({ type: "REGULAR" }));

    expect(plan.type).toBe("REGULAR");
  });

  test("WB-PLAN-04: cobre caminho herbId ausente", () => {
    const { herbId, ...input } = validPlan();

    expectControlledError(() => createPlan(input), 400);
  });

  test("WB-PLAN-05: cobre caminho campo numerico obrigatorio ausente", () => {
    const { temperature, ...input } = validPlan();

    expectControlledError(() => createPlan(input), 400);
  });

  test("WB-PLAN-06: cobre caminho campo numerico com tipo invalido", () => {
    expectControlledError(() => createPlan(validPlan({ temperature: "vinte" })), 400);
  });

  test("WB-PLAN-07: cobre caminho valor abaixo do limite minimo", () => {
    expectControlledError(() => createPlan(validPlan({ temperature: 17 })), 400);
  });

  test("WB-PLAN-08: cobre caminho valor acima do limite maximo", () => {
    expectControlledError(() => createPlan(validPlan({ temperature: 29 })), 400);
  });

  test("WB-PLAN-09: cobre limites inferiores validos dos parametros numericos", () => {
    const plan = createPlan(
      validPlan({
        temperature: 18,
        humidity: 40,
        luminosity: 5000,
        cycleDurationDays: 1
      })
    );

    expect(plan).toMatchObject({
      temperature: 18,
      humidity: 40,
      luminosity: 5000,
      cycleDurationDays: 1
    });
  });

  test("WB-PLAN-10: cobre limites superiores validos dos parametros numericos", () => {
    const plan = createPlan(
      validPlan({
        temperature: 28,
        humidity: 80,
        luminosity: 25000,
        cycleDurationDays: 365
      })
    );

    expect(plan).toMatchObject({
      temperature: 28,
      humidity: 80,
      luminosity: 25000,
      cycleDurationDays: 365
    });
  });

  test("WB-PLAN-11: cobre plano EMERGENCIA valido sem autorizacao especial", () => {
    const plan = createPlan(validPlan({ type: "EMERGENCIA", cycleDurationDays: 30 }));

    expect(plan.type).toBe("EMERGENCIA");
  });

  test("WB-PLAN-12: cobre PONTUAL sem autorizacao explicita", () => {
    expectControlledError(
      () =>
        createPlan(validPlan({ type: "PONTUAL", cycleDurationDays: 30 }), {
          hasResponsibleAuthorization: false,
          authorizedByRole: "RESPONSAVEL"
        }),
      403
    );
  });

  test("WB-PLAN-13: cobre PONTUAL com autorizacao por perfil errado", () => {
    expectControlledError(
      () =>
        createPlan(validPlan({ type: "PONTUAL", cycleDurationDays: 30 }), {
          hasResponsibleAuthorization: true,
          authorizedByRole: "TECNICO"
        }),
      403
    );
  });

  test("WB-PLAN-14: cobre PONTUAL com autorizacao correta", () => {
    const plan = createPlan(validPlan({ type: "PONTUAL", cycleDurationDays: 30 }), {
      hasResponsibleAuthorization: true,
      authorizedByRole: "RESPONSAVEL"
    });

    expect(plan.type).toBe("PONTUAL");
  });

  test("WB-PLAN-15: cobre normalizacao do tipo em minusculas", () => {
    const plan = createPlan(validPlan({ type: "regular" }));

    expect(plan.type).toBe("REGULAR");
  });

  test("WB-PLAN-16: cobre avaliacao completa dos quatro campos numericos", () => {
    const plan = createPlan(validPlan());

    expect(plan).toMatchObject({
      temperature: 23,
      humidity: 60,
      luminosity: 15000,
      cycleDurationDays: 90
    });
  });

  test("WB-PLAN-17: cobre parametro invalido mesmo com autorizacao PONTUAL correta", () => {
    expectControlledError(
      () =>
        createPlan(validPlan({ type: "PONTUAL", temperature: 17, cycleDurationDays: 30 }), {
          hasResponsibleAuthorization: true,
          authorizedByRole: "RESPONSAVEL"
        }),
      400
    );
  });

  test("WB-PLAN-18: cobre complemento MC/DC de PONTUAL sem autorizacao e sem perfil", () => {
    expectControlledError(
      () =>
        createPlan(validPlan({ type: "PONTUAL", cycleDurationDays: 30 }), {
          hasResponsibleAuthorization: false
        }),
      403
    );
  });
});
