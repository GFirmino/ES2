const AppError = require("../errors/AppError");

const FINAL_ALERT_STATES = ["RESOLVIDO", "IGNORADO"];
const VALID_DECISIONS = FINAL_ALERT_STATES;
const JUSTIFICATION_MIN_LENGTH = 10;
const JUSTIFICATION_MAX_LENGTH = 500;

function normalizeDecision(decision) {
  if (typeof decision !== "string") {
    throw new AppError("Decisao invalida.", 400);
  }

  const normalizedDecision = decision.trim().toUpperCase();

  if (!VALID_DECISIONS.includes(normalizedDecision)) {
    throw new AppError("Decisao invalida.", 400);
  }

  return normalizedDecision;
}

function ensureAlertCanBeChanged(alert) {
  const state = alert && (alert.status || alert.decision);

  if (FINAL_ALERT_STATES.includes(state)) {
    throw new AppError("Alerta ja foi fechado.", 409);
  }
}

function validateIgnoreJustification(justification) {
  if (typeof justification !== "string") {
    throw new AppError("Justificacao e obrigatoria para ignorar alerta.", 422);
  }

  const normalizedJustification = justification.trim();

  if (
    normalizedJustification.length < JUSTIFICATION_MIN_LENGTH ||
    normalizedJustification.length > JUSTIFICATION_MAX_LENGTH
  ) {
    throw new AppError("Justificacao deve ter entre 10 e 500 caracteres.", 422);
  }

  return normalizedJustification;
}

function decideAlert(alert, decisionInput) {
  ensureAlertCanBeChanged(alert || {});

  const input = decisionInput || {};
  const decision = normalizeDecision(input.decision);
  const updatedAlert = {
    ...(alert || {}),
    status: decision
  };

  if (decision === "IGNORADO") {
    updatedAlert.justification = validateIgnoreJustification(input.justification);
  }

  return updatedAlert;
}

module.exports = {
  decideAlert
};
