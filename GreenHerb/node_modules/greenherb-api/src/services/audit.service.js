const AppError = require("../errors/AppError");

const AUDITABLE_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

function requireField(input, field) {
  const value = input[field];

  if (value === undefined || value === null || value === "") {
    throw new AppError(`${field} e obrigatorio.`, 400, { field });
  }

  return value;
}

function normalizeTimestamp(timestamp) {
  const date = timestamp ? new Date(timestamp) : new Date();

  if (Number.isNaN(date.getTime())) {
    throw new AppError("timestamp deve ser uma data valida.", 400, { field: "timestamp" });
  }

  return date.toISOString();
}

function createAuditEntry(input) {
  const payload = input || {};

  return {
    userId: requireField(payload, "userId"),
    action: requireField(payload, "action"),
    resource: requireField(payload, "resource"),
    resourceId: payload.resourceId,
    timestamp: normalizeTimestamp(payload.timestamp)
  };
}

function shouldAuditOperation(method) {
  if (typeof method !== "string") {
    return false;
  }

  return AUDITABLE_METHODS.includes(method.trim().toUpperCase());
}

module.exports = {
  createAuditEntry,
  shouldAuditOperation
};
