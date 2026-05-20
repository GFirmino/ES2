const express = require("express");
const AppError = require("../errors/AppError");
const createCrudRouter = require("./crud.routes.factory");
const {
  getItemById,
  createItem,
  updateItem
} = require("../data/resources.memory");
const {
  validateBatchTransition,
  calculateBatchProductivity
} = require("../services/batches.service");
const { sendError, requireAuthAndRoles, auditOperation } = require("./route.helpers");

const router = express.Router();

function requireExistingReference(resourceName, id, field) {
  if (!getItemById(resourceName, id)) {
    throw new AppError(`${field} invalido ou inexistente.`, 400, { field });
  }
}

function validateBatchPayload(payload) {
  const input = payload || {};

  requireExistingReference("herbs", input.herbId, "herbId");
  requireExistingReference("plans", input.planId, "planId");

  if (typeof input.expectedUnits !== "number" || input.expectedUnits <= 0) {
    throw new AppError("expectedUnits deve ser maior do que zero.", 400);
  }

  const state = input.state ? String(input.state).toUpperCase() : "ATIVO";

  if (!["ATIVO", "CONCLUIDO", "COMPROMETIDO"].includes(state)) {
    throw new AppError("Estado invalido.", 400);
  }

  return {
    ...input,
    state,
    harvestedUnits: input.harvestedUnits || 0,
    lostUnits: input.lostUnits || 0,
    dividedUnits: input.dividedUnits || 0
  };
}

router.post("/", ...requireAuthAndRoles(["RESPONSAVEL", "ADMIN"]), (req, res) => {
  try {
    const batch = createItem("batches", validateBatchPayload(req.body));
    auditOperation(req, "CREATE_BATCH", "batches", batch.id);
    return res.status(201).json({ data: batch });
  } catch (error) {
    return sendError(res, error);
  }
});

router.patch("/:id/state", ...requireAuthAndRoles(["RESPONSAVEL", "ADMIN"]), (req, res) => {
  try {
    const batch = getItemById("batches", req.params.id);

    if (!batch) {
      return res.status(404).json({ error: "Recurso nao encontrado." });
    }

    const targetState = req.body && req.body.state;
    const transitionedBatch = validateBatchTransition(batch, targetState, req.body || {});
    const updatePayload = {
      ...transitionedBatch,
      harvestedUnits:
        req.body.harvestedUnits !== undefined ? req.body.harvestedUnits : transitionedBatch.harvestedUnits,
      lostUnits: req.body.lostUnits !== undefined ? req.body.lostUnits : transitionedBatch.lostUnits,
      dividedUnits:
        req.body.dividedUnits !== undefined ? req.body.dividedUnits : transitionedBatch.dividedUnits,
      actualEndDate:
        req.body.actualEndDate !== undefined ? req.body.actualEndDate : transitionedBatch.actualEndDate
    };
    const updatedBatch = updateItem("batches", req.params.id, updatePayload);
    const response = { data: updatedBatch };

    if (updatedBatch.state === "CONCLUIDO") {
      response.productivity = calculateBatchProductivity(updatedBatch);
    }

    auditOperation(req, "UPDATE_BATCH_STATE", "batches", updatedBatch.id);
    return res.status(200).json(response);
  } catch (error) {
    return sendError(res, error);
  }
});

router.get("/:id/productivity", (req, res) => {
  try {
    const batch = getItemById("batches", req.params.id);

    if (!batch) {
      return res.status(404).json({ error: "Recurso nao encontrado." });
    }

    return res.status(200).json({
      data: batch,
      productivity: calculateBatchProductivity(batch)
    });
  } catch (error) {
    return sendError(res, error);
  }
});

router.use(createCrudRouter("batches"));

module.exports = router;
