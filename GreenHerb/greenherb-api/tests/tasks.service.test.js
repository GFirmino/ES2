const { validateTask } = require("../src/services/tasks.service");

function validTask(overrides = {}) {
  return {
    type: "REGA",
    batchId: 1,
    assignedTo: 1,
    scheduledAt: "2026-01-02T10:00:00.000Z",
    status: "PENDENTE",
    ...overrides
  };
}

function expectControlledError(action, statusCode) {
  let caughtError;

  try {
    action();
  } catch (error) {
    caughtError = error;
  }

  expect(caughtError).toBeDefined();
  expect(caughtError.statusCode).toBe(statusCode);
}

describe("Tasks service", () => {
  test("TU-TASK-01: tarefa valida e aceite", () => {
    const task = validateTask(validTask(), { now: "2026-01-01T10:00:00.000Z" });

    expect(task).toMatchObject({
      type: "REGA",
      batchId: 1,
      assignedTo: 1,
      status: "PENDENTE"
    });
  });

  test("TU-TASK-02: tipo invalido devolve erro 400", () => {
    expectControlledError(() => validateTask(validTask({ type: "LIMPEZA" })), 400);
  });

  test("TU-TASK-03: batchId em falta devolve erro 400", () => {
    const { batchId, ...payload } = validTask();

    expectControlledError(() => validateTask(payload), 400);
  });

  test("TU-TASK-04: assignedTo em falta devolve erro 400", () => {
    const { assignedTo, ...payload } = validTask();

    expectControlledError(() => validateTask(payload), 400);
  });

  test("TU-TASK-05: scheduledAt invalido devolve erro 400", () => {
    expectControlledError(() => validateTask(validTask({ scheduledAt: "amanha" })), 400);
  });

  test("TU-TASK-06: status invalido devolve erro 400", () => {
    expectControlledError(() => validateTask(validTask({ status: "ABERTA" })), 400);
  });

  test("TU-TASK-07: tarefa agendada no passado devolve erro 400", () => {
    expectControlledError(
      () =>
        validateTask(validTask({ scheduledAt: "2026-01-01T09:00:00.000Z" }), {
          now: "2026-01-01T10:00:00.000Z"
        }),
      400
    );
  });
});
