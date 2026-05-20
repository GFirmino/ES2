const AppError = require("../errors/AppError");

const VALID_MODES = ["MANUAL", "AUTOMATICO"];

function normalizeMode(mode) {
  if (typeof mode !== "string") {
    throw new AppError("Modo invalido.", 400);
  }

  const normalizedMode = mode.trim().toUpperCase();

  if (!VALID_MODES.includes(normalizedMode)) {
    throw new AppError("Modo invalido.", 400);
  }

  return normalizedMode;
}

function requireBoolean(input, field) {
  if (typeof input[field] !== "boolean") {
    throw new AppError(`${field} deve ser booleano.`, 400, { field });
  }

  return input[field];
}

function decideAutomationAction(input) {
  const payload = input || {};
  const mode = normalizeMode(payload.mode);
  const ruleActive = requireBoolean(payload, "ruleActive");
  const measurementRecent = requireBoolean(payload, "measurementRecent");
  const breachDetected = requireBoolean(payload, "breachDetected");
  const action = payload.suggestedAction || null;
  const operationalConditionsMet = ruleActive && measurementRecent && breachDetected;

  if (!operationalConditionsMet) {
    return {
      decision: "NO_ACTION",
      action
    };
  }

  return {
    decision: mode === "AUTOMATICO" ? "EXECUTE_ACTION" : "SUGGEST_ACTION",
    action
  };
}

module.exports = {
  decideAutomationAction
};
