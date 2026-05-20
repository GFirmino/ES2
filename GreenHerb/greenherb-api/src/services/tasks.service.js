const AppError = require("../errors/AppError");

const VALID_TASK_TYPES = ["REGA", "FERTILIZACAO", "COLHEITA", "MONITORIZACAO"];
const VALID_TASK_STATUSES = ["PENDENTE", "EM_EXECUCAO", "CONCLUIDA", "CANCELADA"];

function normalizeRequiredEnum(value, field, allowedValues) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(`${field} e obrigatorio.`, 400, { field });
  }

  const normalizedValue = value.trim().toUpperCase();

  if (!allowedValues.includes(normalizedValue)) {
    throw new AppError(`${field} invalido.`, 400, { field });
  }

  return normalizedValue;
}

function requireIdentifier(task, field) {
  const value = task[field];

  if (value === undefined || value === null || value === "") {
    throw new AppError(`${field} e obrigatorio.`, 400, { field });
  }

  return value;
}

function normalizeDate(value, field) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${field} deve ser uma data valida.`, 400, { field });
  }

  return date;
}

function validateTask(task, options = {}) {
  const input = task || {};
  const type = normalizeRequiredEnum(input.type, "type", VALID_TASK_TYPES);
  const batchId = requireIdentifier(input, "batchId");
  const assignedTo = requireIdentifier(input, "assignedTo");
  const scheduledAtDate = normalizeDate(requireIdentifier(input, "scheduledAt"), "scheduledAt");
  const status = normalizeRequiredEnum(input.status, "status", VALID_TASK_STATUSES);

  if (options.now) {
    const now = normalizeDate(options.now, "now");

    if (scheduledAtDate.getTime() < now.getTime()) {
      throw new AppError("Tarefa nao pode ser agendada no passado.", 400);
    }
  }

  return {
    type,
    batchId,
    assignedTo,
    scheduledAt: scheduledAtDate.toISOString(),
    status
  };
}

module.exports = {
  validateTask
};
