const { generateCsvReport } = require("../src/services/reports.service");

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

describe("Reports service", () => {
  test("TU-REPORT-01: CSV com dois registos contem cabecalho e duas linhas", () => {
    const csv = generateCsvReport(
      [
        { herb: "Basilico", units: 10 },
        { herb: "Hortela", units: 20 }
      ],
      ["herb", "units"]
    );

    expect(csv).toBe("herb,units\nBasilico,10\nHortela,20");
  });

  test("TU-REPORT-02: CSV com records vazio devolve apenas cabecalho", () => {
    const csv = generateCsvReport([], ["herb", "units"]);

    expect(csv).toBe("herb,units");
  });

  test("TU-REPORT-03: columns vazio devolve erro 400", () => {
    expectControlledError(() => generateCsvReport([], []), 400);
  });

  test("TU-REPORT-04: records nao array devolve erro 400", () => {
    expectControlledError(() => generateCsvReport({}, ["herb"]), 400);
  });

  test("TU-REPORT-05: valor com virgula e escapado com aspas", () => {
    const csv = generateCsvReport([{ herb: "Basilico, doce" }], ["herb"]);

    expect(csv).toBe('herb\n"Basilico, doce"');
  });

  test("TU-REPORT-06: valor com aspas tem aspas escapadas corretamente", () => {
    const csv = generateCsvReport([{ herb: 'Erva "premium"' }], ["herb"]);

    expect(csv).toBe('herb\n"Erva ""premium"""');
  });
});
