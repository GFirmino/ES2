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
  try {
    action();
    throw new Error("Expected action to throw");
  } catch (error) {
    expect(error.statusCode).toBe(statusCode);
  }
}

describe("Plans service", () => {
  test("TU-PLANS-01: cria plano REGULAR valido", () => {
    const plan = createPlan(validPlan({ type: "REGULAR" }));

    expect(plan.type).toBe("REGULAR");
    expect(plan.temperature).toBe(23);
  });

  test("TU-PLANS-02: cria plano EMERGENCIA valido", () => {
    const plan = createPlan(validPlan({ type: "EMERGENCIA" }));

    expect(plan.type).toBe("EMERGENCIA");
  });

  test("TU-PLANS-03: cria plano PONTUAL valido com autorizacao do Responsavel Tecnico", () => {
    const plan = createPlan(validPlan({ type: "PONTUAL" }), {
      hasResponsibleAuthorization: true,
      authorizedByRole: "RESPONSAVEL"
    });

    expect(plan.type).toBe("PONTUAL");
  });

  test("TU-PLANS-04: criar plano com tipo invalido devolve erro controlado 400", () => {
    expectControlledError(() => createPlan(validPlan({ type: "SEMANAL" })), 400);
  });

  test("TU-PLANS-05: criar plano sem type devolve erro controlado 400", () => {
    const { type, ...planWithoutType } = validPlan();

    expectControlledError(() => createPlan(planWithoutType), 400);
  });

  test("TU-PLANS-06: criar plano sem herbId devolve erro controlado 400", () => {
    const { herbId, ...planWithoutHerbId } = validPlan();

    expectControlledError(() => createPlan(planWithoutHerbId), 400);
  });

  test("TU-PLANS-07: criar plano PONTUAL sem autorizacao devolve erro controlado 403", () => {
    expectControlledError(
      () =>
        createPlan(validPlan({ type: "PONTUAL" }), {
          hasResponsibleAuthorization: false
        }),
      403
    );
  });

  test("TU-PLANS-08: criar plano PONTUAL com autorizacao de TECNICO devolve erro controlado 403", () => {
    expectControlledError(
      () =>
        createPlan(validPlan({ type: "PONTUAL" }), {
          hasResponsibleAuthorization: true,
          authorizedByRole: "TECNICO"
        }),
      403
    );
  });

  test("TU-PLANS-09: analise de valores limite para temperature", () => {
    expectControlledError(() => createPlan(validPlan({ temperature: 17 })), 400);
    expect(createPlan(validPlan({ temperature: 18 })).temperature).toBe(18);
    expect(createPlan(validPlan({ temperature: 23 })).temperature).toBe(23);
    expect(createPlan(validPlan({ temperature: 28 })).temperature).toBe(28);
    expectControlledError(() => createPlan(validPlan({ temperature: 29 })), 400);
  });

  test("TU-PLANS-10: analise de valores limite para humidity", () => {
    expectControlledError(() => createPlan(validPlan({ humidity: 39 })), 400);
    expect(createPlan(validPlan({ humidity: 40 })).humidity).toBe(40);
    expect(createPlan(validPlan({ humidity: 60 })).humidity).toBe(60);
    expect(createPlan(validPlan({ humidity: 80 })).humidity).toBe(80);
    expectControlledError(() => createPlan(validPlan({ humidity: 81 })), 400);
  });

  test("TU-PLANS-11: analise de valores limite para luminosity", () => {
    expectControlledError(() => createPlan(validPlan({ luminosity: 4999 })), 400);
    expect(createPlan(validPlan({ luminosity: 5000 })).luminosity).toBe(5000);
    expect(createPlan(validPlan({ luminosity: 15000 })).luminosity).toBe(15000);
    expect(createPlan(validPlan({ luminosity: 25000 })).luminosity).toBe(25000);
    expectControlledError(() => createPlan(validPlan({ luminosity: 25001 })), 400);
  });

  test("TU-PLANS-12: analise de valores limite para cycleDurationDays", () => {
    expectControlledError(() => createPlan(validPlan({ cycleDurationDays: 0 })), 400);
    expect(createPlan(validPlan({ cycleDurationDays: 1 })).cycleDurationDays).toBe(1);
    expect(createPlan(validPlan({ cycleDurationDays: 90 })).cycleDurationDays).toBe(90);
    expect(createPlan(validPlan({ cycleDurationDays: 365 })).cycleDurationDays).toBe(365);
    expectControlledError(() => createPlan(validPlan({ cycleDurationDays: 366 })), 400);
  });

  test("TU-PLANS-13: campos numericos com tipo invalido devolvem erro controlado 400", () => {
    expectControlledError(() => createPlan(validPlan({ temperature: "vinte" })), 400);
  });

  test("TU-PLANS-14: normaliza tipo de plano em minusculas", () => {
    const plan = createPlan(validPlan({ type: "regular" }));

    expect(plan.type).toBe("REGULAR");
  });

  test("TU-PLANS-15: cobertura MC/DC da regra do plano PONTUAL", () => {
    expect(
      createPlan(validPlan({ type: "REGULAR" }), {
        hasResponsibleAuthorization: false,
        authorizedByRole: "RESPONSAVEL"
      }).type
    ).toBe("REGULAR");

    expectControlledError(
      () =>
        createPlan(validPlan({ type: "PONTUAL" }), {
          hasResponsibleAuthorization: false,
          authorizedByRole: "RESPONSAVEL"
        }),
      403
    );

    expect(
      createPlan(validPlan({ type: "PONTUAL" }), {
        hasResponsibleAuthorization: true,
        authorizedByRole: "RESPONSAVEL"
      }).type
    ).toBe("PONTUAL");

    expectControlledError(
      () =>
        createPlan(validPlan({ type: "PONTUAL" }), {
          hasResponsibleAuthorization: true,
          authorizedByRole: "TECNICO"
        }),
      403
    );

    expectControlledError(
      () =>
        createPlan(validPlan({ type: "PONTUAL", temperature: 29 }), {
          hasResponsibleAuthorization: true,
          authorizedByRole: "RESPONSAVEL"
        }),
      400
    );
  });
});
