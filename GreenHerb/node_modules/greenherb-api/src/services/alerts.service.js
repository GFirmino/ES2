const AppError = require("../errors/AppError");

const REQUIRED_PLAN_LIMITS = [
  "temperatureMin",
  "temperatureMax",
  "humidityMin",
  "humidityMax",
  "luminosityMin",
  "luminosityMax"
];

function requireNumericPlanLimit(plan, field) {
  const value = plan[field];

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new AppError("Plano sem limites obrigatorios.", 400, { field });
  }

  return value;
}

function validatePlanLimits(plan) {
  const input = plan || {};
  const limits = {};

  REQUIRED_PLAN_LIMITS.forEach((field) => {
    limits[field] = requireNumericPlanLimit(input, field);
  });

  if (
    limits.temperatureMin > limits.temperatureMax ||
    limits.humidityMin > limits.humidityMax ||
    limits.luminosityMin > limits.luminosityMax
  ) {
    throw new AppError("Plano com limites incoerentes.", 400);
  }

  return limits;
}

function addReasonIfOutOfRange(reasons, value, min, max, label) {
  if (value < min) {
    reasons.push(`${label} abaixo do minimo`);
  } else if (value > max) {
    reasons.push(`${label} acima do maximo`);
  }
}

function classifyByViolationCount(count) {
  if (count === 1) {
    return "INFORMATIVO";
  }

  if (count === 2) {
    return "AVISO";
  }

  return "CRITICO";
}

function classifyAlert(measurement, plan) {
  const limits = validatePlanLimits(plan);
  const input = measurement || {};

  if (input.sensorOK === false) {
    return null;
  }

  const reasons = [];

  addReasonIfOutOfRange(
    reasons,
    input.temperature,
    limits.temperatureMin,
    limits.temperatureMax,
    "temperatura"
  );
  addReasonIfOutOfRange(reasons, input.humidity, limits.humidityMin, limits.humidityMax, "humidade");
  addReasonIfOutOfRange(
    reasons,
    input.luminosity,
    limits.luminosityMin,
    limits.luminosityMax,
    "luminosidade"
  );

  if (reasons.length === 0) {
    return null;
  }

  return {
    classification: classifyByViolationCount(reasons.length),
    reasons
  };
}

module.exports = {
  classifyAlert
};
