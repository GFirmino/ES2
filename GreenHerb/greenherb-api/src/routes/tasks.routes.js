const express = require("express");
const createCrudRouter = require("./crud.routes.factory");
const { getItemById, createItem, updateItem } = require("../data/resources.memory");
const { validateTask } = require("../services/tasks.service");
const { sendError, requireAuthAndRoles, auditOperation } = require("./route.helpers");

const router = express.Router();

router.post("/", ...requireAuthAndRoles(["TECNICO", "RESPONSAVEL", "ADMIN"]), (req, res) => {
  try {
    const task = createItem("tasks", validateTask(req.body));
    auditOperation(req, "CREATE_TASK", "tasks", task.id);
    return res.status(201).json({ data: task });
  } catch (error) {
    return sendError(res, error);
  }
});

router.put("/:id", ...requireAuthAndRoles(["TECNICO", "RESPONSAVEL", "ADMIN"]), (req, res) => {
  try {
    const existingTask = getItemById("tasks", req.params.id);

    if (!existingTask) {
      return res.status(404).json({ error: "Recurso nao encontrado." });
    }

    const validatedTask = validateTask({
      ...existingTask,
      ...req.body
    });
    const updatedTask = updateItem("tasks", req.params.id, validatedTask);

    auditOperation(req, "UPDATE_TASK", "tasks", updatedTask.id);
    return res.status(200).json({ data: updatedTask });
  } catch (error) {
    return sendError(res, error);
  }
});

router.use(createCrudRouter("tasks"));

module.exports = router;
