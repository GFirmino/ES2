const AppError = require("../errors/AppError");
const { classifyAlert } = require("./alerts.service");
const { validateMeasurement } = require("./measurements.service");

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

function requireGateway(dependencies) {
  const gateway = dependencies.temperatureGateway;

  if (!gateway || typeof gateway.getCurrentTemperature !== "function") {
    throw new AppError("Gateway de temperatura nao configurado.", 400);
  }

  return gateway;
}

function calculateMiddleValue(min, max) {
  return (min + max) / 2;
}

function validatePlanForAutomaticTemperature(plan) {
  const input = plan || {};

  const limits = {
    temperatureMin: requireNumber(input, "temperatureMin"),
    temperatureMax: requireNumber(input, "temperatureMax"),
    humidityMin: requireNumber(input, "humidityMin"),
    humidityMax: requireNumber(input, "humidityMax"),
    luminosityMin: requireNumber(input, "luminosityMin"),
    luminosityMax: requireNumber(input, "luminosityMax")
  };

  if (
    limits.temperatureMin > limits.temperatureMax ||
    limits.humidityMin > limits.humidityMax ||
    limits.luminosityMin > limits.luminosityMax
  ) {
    throw new AppError("Plano com limites incoerentes.", 400);
  }

  return limits;
}

function validateReading(reading) {
  if (!reading) {
    throw new AppError("Leitura de temperatura nao encontrada.", 404);
  }

  const sensorOK = reading.sensorOK !== undefined ? reading.sensorOK : true;

  if (typeof sensorOK !== "boolean") {
    throw new AppError("sensorOK deve ser booleano.", 400, { field: "sensorOK" });
  }

  if (sensorOK && (typeof reading.temperature !== "number" || !Number.isFinite(reading.temperature))) {
    throw new AppError("temperature deve ser numerico.", 400, { field: "temperature" });
  }

  return {
    ...reading,
    sensorOK
  };
}

function buildNotification(input, measurement, limits) {
  return {
    recipientRole: "RESPONSAVEL",
    type: "TEMPERATURE_ALERT",
    message: "Temperatura fora dos limites",
    payload: {
      batchId: input.batchId,
      sensorId: input.sensorId,
      temperature: measurement.temperature,
      limits: {
        temperatureMin: limits.temperatureMin,
        temperatureMax: limits.temperatureMax
      }
    }
  };
}

async function saveMeasurement(measurement, measurementRepository) {
  if (measurementRepository && typeof measurementRepository.create === "function") {
    return measurementRepository.create(measurement);
  }

  return measurement;
}

async function collectAutomaticTemperatureMeasurement(input, dependencies = {}) {
  const data = input || {};
  const sensorId = requireValue(data, "sensorId");
  const batchId = requireValue(data, "batchId");
  const limits = validatePlanForAutomaticTemperature(data.plan);
  const temperatureGateway = requireGateway(dependencies);
  const reading = validateReading(await temperatureGateway.getCurrentTemperature(sensorId));

  const measurementBase = {
    batchId,
    temperature: reading.temperature,
    humidity: calculateMiddleValue(limits.humidityMin, limits.humidityMax),
    luminosity: calculateMiddleValue(limits.luminosityMin, limits.luminosityMax),
    measuredAt: reading.measuredAt || new Date().toISOString(),
    sensorOK: reading.sensorOK
  };

  const normalizedMeasurement = validateMeasurement(measurementBase);
  const measurement = await saveMeasurement(
    {
      ...normalizedMeasurement,
      sensorId,
      valid: reading.sensorOK
    },
    dependencies.measurementRepository
  );

  if (reading.sensorOK === false) {
    return {
      measurement,
      alert: null,
      notificationSent: false
    };
  }

  const alertResult = classifyAlert(measurement, limits);

  if (!alertResult) {
    return {
      measurement,
      alert: null,
      notificationSent: false
    };
  }

  const alert = {
    ...alertResult,
    batchId,
    sensorId,
    temperature: measurement.temperature
  };

  let notificationSent = false;

  if (dependencies.notificationGateway && typeof dependencies.notificationGateway.sendNotification === "function") {
    await dependencies.notificationGateway.sendNotification(buildNotification(data, measurement, limits));
    notificationSent = true;
  }

  return {
    measurement,
    alert,
    notificationSent
  };
}

module.exports = {
  collectAutomaticTemperatureMeasurement
};
