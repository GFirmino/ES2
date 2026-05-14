const AppError = require("../errors/AppError");

const EXPECTED_HEADERS = [
  "commonName",
  "scientificName",
  "idealTemperatureMin",
  "idealTemperatureMax",
  "idealHumidityMin",
  "idealHumidityMax",
  "idealLuminosityMin",
  "idealLuminosityMax",
  "cycleDurationDays"
];

const REQUIRED_FIELDS = ["commonName", "scientificName"];

const NUMERIC_FIELDS = [
  "idealTemperatureMin",
  "idealTemperatureMax",
  "idealHumidityMin",
  "idealHumidityMax",
  "idealLuminosityMin",
  "idealLuminosityMax",
  "cycleDurationDays"
];

const FIELD_RANGES = {
  idealTemperatureMin: { min: 18, max: 28, label: "temperatura" },
  idealTemperatureMax: { min: 18, max: 28, label: "temperatura" },
  idealHumidityMin: { min: 40, max: 80, label: "humidade" },
  idealHumidityMax: { min: 40, max: 80, label: "humidade" },
  idealLuminosityMin: { min: 5000, max: 25000, label: "luminosidade" },
  idealLuminosityMax: { min: 5000, max: 25000, label: "luminosidade" },
  cycleDurationDays: { min: 1, max: 365, label: "duracao do ciclo" }
};

function normalizeKey(value) {
  return String(value || "").trim().toLowerCase();
}

function parseCsvLine(line) {
  return line.split(",").map((value) => value.trim());
}

function validateCsvContent(csvContent) {
  if (typeof csvContent !== "string" || csvContent.trim().length === 0) {
    throw new AppError("CSV vazio ou invalido.", 400);
  }
}

function validateHeader(headerLine) {
  const header = parseCsvLine(headerLine.replace(/^\uFEFF/, ""));
  const missingHeaders = EXPECTED_HEADERS.filter((field) => !header.includes(field));

  if (missingHeaders.length > 0) {
    throw new AppError("Cabecalho CSV invalido.", 400, { missingHeaders });
  }

  return header;
}

function buildRowObject(header, values) {
  return header.reduce((row, field, index) => {
    row[field] = values[index] === undefined ? "" : values[index];
    return row;
  }, {});
}

function parseNumericFields(row, errors) {
  NUMERIC_FIELDS.forEach((field) => {
    const value = row[field];

    if (value === undefined || value === "") {
      return;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      errors.push(`${field} deve ser numerico`);
      return;
    }

    const range = FIELD_RANGES[field];

    if (numberValue < range.min || numberValue > range.max) {
      errors.push(`${range.label} fora do intervalo permitido`);
      return;
    }

    row[field] = numberValue;
  });
}

function validateRequiredFields(row, errors) {
  REQUIRED_FIELDS.forEach((field) => {
    if (typeof row[field] !== "string" || row[field].trim().length === 0) {
      errors.push(`${field} e obrigatorio`);
    }
  });
}

function validateMinMax(row, errors) {
  const pairs = [
    ["idealTemperatureMin", "idealTemperatureMax", "temperatura minima nao pode exceder maxima"],
    ["idealHumidityMin", "idealHumidityMax", "humidade minima nao pode exceder maxima"],
    ["idealLuminosityMin", "idealLuminosityMax", "luminosidade minima nao pode exceder maxima"]
  ];

  pairs.forEach(([minField, maxField, message]) => {
    if (
      typeof row[minField] === "number" &&
      typeof row[maxField] === "number" &&
      row[minField] > row[maxField]
    ) {
      errors.push(message);
    }
  });
}

function isDuplicateHerb(row, knownHerbs) {
  const commonName = normalizeKey(row.commonName);
  const scientificName = normalizeKey(row.scientificName);

  return knownHerbs.some((herb) => {
    const knownCommonName = normalizeKey(herb.commonName || herb.name);
    const knownScientificName = normalizeKey(herb.scientificName);

    return knownCommonName === commonName || knownScientificName === scientificName;
  });
}

function validateRow(row) {
  const errors = [];

  validateRequiredFields(row, errors);
  parseNumericFields(row, errors);
  validateMinMax(row, errors);

  return errors;
}

function importHerbsFromCsv(csvContent, existingHerbs = []) {
  validateCsvContent(csvContent);

  const lines = csvContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const header = validateHeader(lines[0]);
  const imported = [];
  const errors = [];
  const knownHerbs = [...existingHerbs];

  const summary = {
    totalRows: Math.max(lines.length - 1, 0),
    importedRows: 0,
    invalidRows: 0,
    duplicateRows: 0,
    ignoredRows: 0
  };

  lines.slice(1).forEach((line, index) => {
    const rowNumber = index + 2;

    if (line.trim().length === 0) {
      summary.ignoredRows += 1;
      return;
    }

    const row = buildRowObject(header, parseCsvLine(line));
    const rowErrors = validateRow(row);

    if (rowErrors.length > 0) {
      summary.invalidRows += 1;
      errors.push({
        row: rowNumber,
        reason: rowErrors.join("; ")
      });
      return;
    }

    if (isDuplicateHerb(row, knownHerbs)) {
      summary.duplicateRows += 1;
      return;
    }

    const herb = {
      commonName: row.commonName.trim(),
      scientificName: row.scientificName.trim()
    };

    NUMERIC_FIELDS.forEach((field) => {
      if (typeof row[field] === "number") {
        herb[field] = row[field];
      }
    });

    imported.push(herb);
    knownHerbs.push(herb);
    summary.importedRows += 1;
  });

  return {
    imported,
    summary,
    errors
  };
}

module.exports = {
  importHerbsFromCsv
};
