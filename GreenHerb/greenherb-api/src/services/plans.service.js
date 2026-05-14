const AppError = require("../errors/AppError");

const VALID_PLAN_TYPES = ["REGULAR", "EMERGENCIA", "PONTUAL"];

const LIMITS = {
  temperature: { min: 18, max: 28 },
  humidity: { min: 40, max: 80 },
  luminosity: { min: 5000, max: 25000 },
  cycleDurationDays: { min: 1, max: 365 }
};

function normalizePlanType(type) {
  if (type === undefined || type === null || type === "") {
    throw new AppError("Type e obrigatorio.", 400);
  }

  if (typeof type !== "string") {
    throw new AppError("Type deve ser uma string.", 400);
  }

  const normalizedType = type.trim().toUpperCase();

  if (!VALID_PLAN_TYPES.includes(normalizedType)) {
    throw new AppError("Tipo de plano invalido.", 400);
  }

  return normalizedType;
}

function validateHerbId(herbId) {
  if (herbId === undefined || herbId === null || herbId === "") {
    throw new AppError("HerbId e obrigatorio.", 400);
  }

  if (typeof herbId !== "number" || !Number.isFinite(herbId)) {
    throw new AppError("HerbId deve ser numerico.", 400);
  }

  return herbId;
}

function validateRequiredNumber(input, field) {
  const value = input[field];

  if (value === undefined || value === null || value === "") {
    throw new AppError(`${field} e obrigatorio.`, 400, { field });
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new AppError(`${field} deve ser numerico.`, 400, { field });
  }

  const limits = LIMITS[field];

  if (value < limits.min || value > limits.max) {
    throw new AppError(`${field} fora do intervalo permitido.`, 400, {
      field,
      min: limits.min,
      max: limits.max
    });
  }

  return value;
}

function validatePlanParameters(planInput) {
  return {
    herbId: validateHerbId(planInput.herbId),
    temperature: validateRequiredNumber(planInput, "temperature"),
    humidity: validateRequiredNumber(planInput, "humidity"),
    luminosity: validateRequiredNumber(planInput, "luminosity"),
    cycleDurationDays: validateRequiredNumber(planInput, "cycleDurationDays")
  };
}

function validatePontualAuthorization(type, options) {
  if (type !== "PONTUAL") {
    return;
  }

  if (options.hasResponsibleAuthorization !== true) {
    throw new AppError("Plano PONTUAL exige autorizacao do Responsavel Tecnico.", 403);
  }

  if (options.authorizedByRole !== "RESPONSAVEL") {
    throw new AppError("Plano PONTUAL deve ser autorizado por RESPONSAVEL.", 403);
  }
}

function createPlan(planInput, options = {}) {
  const input = planInput || {};
  const type = normalizePlanType(input.type);
  const parameters = validatePlanParameters(input);

  validatePontualAuthorization(type, options || {});

  return {
    type,
    ...parameters
  };
}

module.exports = {
  createPlan
};
