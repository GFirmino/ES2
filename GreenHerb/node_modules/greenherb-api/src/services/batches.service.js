const AppError = require("../errors/AppError");

const VALID_BATCH_STATES = ["ATIVO", "CONCLUIDO", "COMPROMETIDO"];
const CLOSED_STATES = ["CONCLUIDO", "COMPROMETIDO"];

function normalizeState(state) {
  if (typeof state !== "string") {
    throw new AppError("Estado invalido.", 400);
  }

  const normalizedState = state.trim().toUpperCase();

  if (!VALID_BATCH_STATES.includes(normalizedState)) {
    throw new AppError("Estado invalido.", 400);
  }

  return normalizedState;
}

function isValidDate(value) {
  return value !== undefined && value !== null && !Number.isNaN(new Date(value).getTime());
}

function validateBatchTransition(batch, targetState, context = {}) {
  const input = batch || {};
  const currentState = normalizeState(input.state);
  const normalizedTargetState = normalizeState(targetState);

  if (CLOSED_STATES.includes(currentState) && normalizedTargetState === "ATIVO") {
    throw new AppError("Lote fechado nao pode voltar a ATIVO.", 409);
  }

  if (currentState === "ATIVO" && normalizedTargetState === "CONCLUIDO") {
    const actualEndDate = context.actualEndDate || input.actualEndDate;

    if (!isValidDate(actualEndDate)) {
      throw new AppError("Conclusao exige data real de fim.", 400);
    }

    return {
      ...input,
      state: normalizedTargetState,
      actualEndDate: new Date(actualEndDate).toISOString()
    };
  }

  if (currentState === "ATIVO" && normalizedTargetState === "COMPROMETIDO") {
    const lostUnits = context.lostUnits !== undefined ? context.lostUnits : input.lostUnits;
    const hasLosses = typeof lostUnits === "number" && lostUnits > 0;
    const hasOpenCriticalAlert = context.hasOpenCriticalAlert === true || input.hasOpenCriticalAlert === true;

    if (!hasLosses && !hasOpenCriticalAlert) {
      throw new AppError("Comprometimento exige perdas ou alerta critico aberto.", 400);
    }
  }

  return {
    ...input,
    state: normalizedTargetState
  };
}

function readNonNegativeNumber(batch, field, defaultValue = 0) {
  const value = batch[field] === undefined ? defaultValue : batch[field];

  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new AppError(`${field} deve ser numerico e nao negativo.`, 400, { field });
  }

  return value;
}

function calculateBatchProductivity(batch) {
  const input = batch || {};
  const state = normalizeState(input.state);

  if (state !== "CONCLUIDO") {
    throw new AppError("Produtividade so pode ser calculada para lote concluido.", 409);
  }

  const expectedUnits = input.expectedUnits;

  if (typeof expectedUnits !== "number" || !Number.isFinite(expectedUnits) || expectedUnits <= 0) {
    throw new AppError("expectedUnits deve ser maior do que zero.", 400);
  }

  const harvestedUnits = readNonNegativeNumber(input, "harvestedUnits");
  const lostUnits = readNonNegativeNumber(input, "lostUnits");
  const dividedUnits = readNonNegativeNumber(input, "dividedUnits");
  const netProduced = Math.max(harvestedUnits + dividedUnits - lostUnits, 0);
  const productivityPercentage = Math.round((netProduced / expectedUnits) * 10000) / 100;

  return {
    netProduced,
    productivityPercentage
  };
}

module.exports = {
  validateBatchTransition,
  calculateBatchProductivity
};
