const express = require("express");
const createCrudRouter = require("./crud.routes.factory");
const { listItems, getItemById, updateItem } = require("../data/resources.memory");
const { decideAlert } = require("../services/alertDecision.service");
const { sendError, requireAuthAndRoles, auditOperation } = require("./route.helpers");

const router = express.Router();

router.get("/", ...requireAuthAndRoles(["RESPONSAVEL", "ADMIN"]), (req, res) => {
  res.status(200).json({ data: listItems("alerts") });
});

router.patch("/:id", ...requireAuthAndRoles(["RESPONSAVEL", "ADMIN"]), (req, res) => {
  try {
    const alert = getItemById("alerts", req.params.id);

    if (!alert) {
      return res.status(404).json({ error: "Recurso nao encontrado." });
    }

    const decidedAlert = decideAlert(alert, req.body || {});
    const updatedAlert = updateItem("alerts", req.params.id, decidedAlert);

    auditOperation(req, "DECIDE_ALERT", "alerts", updatedAlert.id);
    return res.status(200).json({ data: updatedAlert });
  } catch (error) {
    return sendError(res, error);
  }
});

router.use(createCrudRouter("alerts"));

module.exports = router;
