const { importHerbsFromCsv } = require("../src/services/herbsImport.service");

const HEADER =
  "commonName,scientificName,idealTemperatureMin,idealTemperatureMax,idealHumidityMin,idealHumidityMax,idealLuminosityMin,idealLuminosityMax,cycleDurationDays";

function buildRow(
  commonName,
  scientificName,
  idealTemperatureMin = 18,
  idealTemperatureMax = 28,
  idealHumidityMin = 40,
  idealHumidityMax = 80,
  idealLuminosityMin = 5000,
  idealLuminosityMax = 25000,
  cycleDurationDays = 90
) {
  return [
    commonName,
    scientificName,
    idealTemperatureMin,
    idealTemperatureMax,
    idealHumidityMin,
    idealHumidityMax,
    idealLuminosityMin,
    idealLuminosityMax,
    cycleDurationDays
  ].join(",");
}

function buildCsv(rows) {
  return [HEADER, ...rows].join("\n");
}

function expectControlledError(action, statusCode) {
  try {
    action();
    throw new Error("Expected action to throw");
  } catch (error) {
    expect(error.statusCode).toBe(statusCode);
  }
}

describe("Herbs import service", () => {
  test("TU-HERBS-01: CSV valido com duas linhas validas importa duas ervas", () => {
    const csv = buildCsv([
      buildRow("Basilico", "Ocimum basilicum"),
      buildRow("Hortela", "Mentha spicata")
    ]);

    const result = importHerbsFromCsv(csv);

    expect(result.summary.importedRows).toBe(2);
    expect(result.summary.invalidRows).toBe(0);
    expect(result.summary.duplicateRows).toBe(0);
    expect(result.imported).toHaveLength(2);
  });

  test("TU-HERBS-02: CSV vazio devolve erro controlado 400", () => {
    expectControlledError(() => importHerbsFromCsv(""), 400);
  });

  test("TU-HERBS-03: CSV com cabecalho invalido devolve erro controlado 400", () => {
    const csv = "name,scientific\nBasilico,Ocimum basilicum";

    expectControlledError(() => importHerbsFromCsv(csv), 400);
  });

  test("TU-HERBS-04: CSV com uma linha valida e uma invalida por commonName vazio", () => {
    const csv = buildCsv([
      buildRow("Basilico", "Ocimum basilicum"),
      buildRow("", "Mentha spicata")
    ]);

    const result = importHerbsFromCsv(csv);

    expect(result.summary.importedRows).toBe(1);
    expect(result.summary.invalidRows).toBe(1);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          row: 3,
          reason: expect.stringContaining("commonName")
        })
      ])
    );
  });

  test("TU-HERBS-05: CSV com valores numericos invalidos rejeita a linha", () => {
    const csv = buildCsv([buildRow("Basilico", "Ocimum basilicum", "quente", 28)]);

    const result = importHerbsFromCsv(csv);

    expect(result.summary.importedRows).toBe(0);
    expect(result.summary.invalidRows).toBe(1);
  });

  test("TU-HERBS-06: CSV com erva duplicada face a existingHerbs nao importa duplicado", () => {
    const csv = buildCsv([buildRow("Basilico", "Ocimum basilicum")]);
    const existingHerbs = [{ commonName: "Basilico", scientificName: "Ocimum basilicum" }];

    const result = importHerbsFromCsv(csv, existingHerbs);

    expect(result.summary.duplicateRows).toBe(1);
    expect(result.summary.importedRows).toBe(0);
    expect(result.imported).toHaveLength(0);
  });

  test("TU-HERBS-07: CSV com linhas vazias ignora vazias e importa linhas validas", () => {
    const csv = buildCsv([
      buildRow("Basilico", "Ocimum basilicum"),
      "",
      "   ",
      buildRow("Hortela", "Mentha spicata")
    ]);

    const result = importHerbsFromCsv(csv);

    expect(result.summary.ignoredRows).toBe(2);
    expect(result.summary.importedRows).toBe(2);
    expect(result.summary.invalidRows).toBe(0);
  });

  test("TU-HERBS-08: analise de valores limite para temperatura", () => {
    const csv = buildCsv([
      buildRow("Temp17", "Tempus 17", 17, 17),
      buildRow("Temp18", "Tempus 18", 18, 18),
      buildRow("Temp23", "Tempus 23", 23, 23),
      buildRow("Temp28", "Tempus 28", 28, 28),
      buildRow("Temp29", "Tempus 29", 29, 29)
    ]);

    const result = importHerbsFromCsv(csv);

    expect(result.summary.importedRows).toBe(3);
    expect(result.summary.invalidRows).toBe(2);
    expect(result.imported.map((herb) => herb.commonName)).toEqual(["Temp18", "Temp23", "Temp28"]);
  });

  test("TU-HERBS-09: analise de valores limite para humidade", () => {
    const csv = buildCsv([
      buildRow("Hum39", "Humidus 39", 18, 28, 39, 39),
      buildRow("Hum40", "Humidus 40", 18, 28, 40, 40),
      buildRow("Hum60", "Humidus 60", 18, 28, 60, 60),
      buildRow("Hum80", "Humidus 80", 18, 28, 80, 80),
      buildRow("Hum81", "Humidus 81", 18, 28, 81, 81)
    ]);

    const result = importHerbsFromCsv(csv);

    expect(result.summary.importedRows).toBe(3);
    expect(result.summary.invalidRows).toBe(2);
    expect(result.imported.map((herb) => herb.commonName)).toEqual(["Hum40", "Hum60", "Hum80"]);
  });

  test("TU-HERBS-10: analise de valores limite para luminosidade", () => {
    const csv = buildCsv([
      buildRow("Lum4999", "Lux 4999", 18, 28, 40, 80, 4999, 4999),
      buildRow("Lum5000", "Lux 5000", 18, 28, 40, 80, 5000, 5000),
      buildRow("Lum15000", "Lux 15000", 18, 28, 40, 80, 15000, 15000),
      buildRow("Lum25000", "Lux 25000", 18, 28, 40, 80, 25000, 25000),
      buildRow("Lum25001", "Lux 25001", 18, 28, 40, 80, 25001, 25001)
    ]);

    const result = importHerbsFromCsv(csv);

    expect(result.summary.importedRows).toBe(3);
    expect(result.summary.invalidRows).toBe(2);
    expect(result.imported.map((herb) => herb.commonName)).toEqual([
      "Lum5000",
      "Lum15000",
      "Lum25000"
    ]);
  });

  test("TU-HERBS-11: analise de valores limite para duracao do ciclo", () => {
    const csv = buildCsv([
      buildRow("Cycle0", "Cycle 0", 18, 28, 40, 80, 5000, 25000, 0),
      buildRow("Cycle1", "Cycle 1", 18, 28, 40, 80, 5000, 25000, 1),
      buildRow("Cycle90", "Cycle 90", 18, 28, 40, 80, 5000, 25000, 90),
      buildRow("Cycle365", "Cycle 365", 18, 28, 40, 80, 5000, 25000, 365),
      buildRow("Cycle366", "Cycle 366", 18, 28, 40, 80, 5000, 25000, 366)
    ]);

    const result = importHerbsFromCsv(csv);

    expect(result.summary.importedRows).toBe(3);
    expect(result.summary.invalidRows).toBe(2);
    expect(result.imported.map((herb) => herb.commonName)).toEqual([
      "Cycle1",
      "Cycle90",
      "Cycle365"
    ]);
  });
});
