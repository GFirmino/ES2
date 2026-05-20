const AppError = require("../errors/AppError");

function validateInputs(records, columns) {
  if (!Array.isArray(records)) {
    throw new AppError("records deve ser array.", 400);
  }

  if (!Array.isArray(columns) || columns.length === 0) {
    throw new AppError("columns deve ser array nao vazio.", 400);
  }
}

function escapeCsvValue(value) {
  if (value === undefined || value === null) {
    return "";
  }

  const stringValue = String(value);
  const mustEscape =
    stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n");

  if (!mustEscape) {
    return stringValue;
  }

  return `"${stringValue.replace(/"/g, "\"\"")}"`;
}

function generateCsvReport(records, columns) {
  validateInputs(records, columns);

  const header = columns.map(escapeCsvValue).join(",");
  const rows = records.map((record) =>
    columns.map((column) => escapeCsvValue(record[column])).join(",")
  );

  return [header, ...rows].join("\n");
}

module.exports = {
  generateCsvReport
};
