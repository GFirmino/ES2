const express = require("express");
const AppError = require("../errors/AppError");
const createCrudRouter = require("./crud.routes.factory");
const { getItemById, createItem } = require("../data/resources.memory");
const { validateMeasurement } = require("../services/measurements.service");
const { classifyAlert } = require("../services/alerts.service");
const { sendError, requireAuthAndRoles, auditOperation } = require("./route.helpers");

const router = express.Router();

function buildPlanLimits(plan) {
  return {
    temperatureMin: plan.temperatureMin || 18,
    temperatureMax: plan.temperatureMax || 28,
    humidityMin: plan.humidityMin || 40,
    humidityMax: plan.humidityMax || 80,
    luminosityMin: plan.luminosityMin || 5000,
    luminosityMax: plan.luminosityMax || 25000
  };
}

router.post("/", ...requireAuthAndRoles(["TECNICO", "RESPONSAVEL", "ADMIN"]), (req, res) => {
  try {
    const measurementInput = validateMeasurement(req.body);
    const batch = getItemById("batches", measurementInput.batchId);

    if (!batch) {
      throw new AppError("batchId invalido ou inexistente.", 400, { field: "batchId" });
    }

    const plan = getItemById("plans", batch.planId);

    if (!plan) {
      throw new AppError("Plano associado ao lote nao encontrado.", 400, { field: "planId" });
    }

    const measurement = createItem("measurements", measurementInput);
    const alertResult = classifyAlert(measurementInput, buildPlanLimits(plan));
    let alert = null;

    if (alertResult) {
      alert = createItem("alerts", {
        batchId: batch.id,
        measurementId: measurement.id,
        classification: alertResult.classification,
        reasons: alertResult.reasons,
        status: "ABERTO"
      });
      auditOperation(req, "CREATE_ALERT", "alerts", alert.id);
    }

    auditOperation(req, "CREATE_MEASUREMENT", "measurements", measurement.id);
    return res.status(201).json({ data: measurement, alert });
  } catch (error) {
    return sendError(res, error);
  }
});

router.use(createCrudRouter("measurements"));

module.exports = router;
