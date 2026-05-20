const AppError = require("../errors/AppError");

function requireValue(input, field) {
  const value = input[field];

  if (value === undefined || value === null || value === "") {
    throw new AppError(`${field} e obrigatorio.`, 400, { field });
  }

  return value;
}

function requireNumber(input, field) {
  const value = requireValue(input, field);

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new AppError(`${field} deve ser numerico.`, 400, { field });
  }

  return value;
}

function validateRange(value, field, min, max) {
  if (value < min || value > max) {
    throw new AppError(`${field} fora do intervalo permitido.`, 400, {
      field,
      min,
      max
    });
  }
}

function validateDate(value, field) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${field} deve ser uma data valida.`, 400, { field });
  }

  return date.toISOString();
}

function validateMeasurement(measurement) {
  const input = measurement || {};
  const batchId = requireValue(input, "batchId");
  const temperature = requireNumber(input, "temperature");
  const humidity = requireNumber(input, "humidity");
  const luminosity = requireNumber(input, "luminosity");
  const measuredAt = validateDate(requireValue(input, "measuredAt"), "measuredAt");
  const sensorOK = requireValue(input, "sensorOK");

  if (typeof sensorOK !== "boolean") {
    throw new AppError("sensorOK deve ser booleano.", 400, { field: "sensorOK" });
  }

  validateRange(temperature, "temperature", -10, 60);
  validateRange(humidity, "humidity", 0, 100);

  if (luminosity < 0) {
    throw new AppError("luminosity nao pode ser negativa.", 400, { field: "luminosity" });
  }

  return {
    batchId,
    temperature,
    humidity,
    luminosity,
    measuredAt,
    sensorOK
  };
}

module.exports = {
  validateMeasurement
};
