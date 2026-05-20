const express = require("express");
const createCrudRouter = require("./crud.routes.factory");
const { createItem } = require("../data/resources.memory");
const { decideAutomationAction } = require("../services/automation.service");
const { sendError, requireAuthAndRoles, auditOperation } = require("./route.helpers");

const router = express.Router();

router.post("/", ...requireAuthAndRoles(["RESPONSAVEL", "ADMIN"]), (req, res) => {
  try {
    const decision = decideAutomationAction(req.body || {});
    const automationRule = createItem("automation", {
      ...(req.body || {}),
      decision: decision.decision,
      action: decision.action
    });

    auditOperation(req, "CREATE_AUTOMATION_RULE", "automation", automationRule.id);
    return res.status(201).json({ data: automationRule, decision: decision.decision, action: decision.action });
  } catch (error) {
    return sendError(res, error);
  }
});

router.use(createCrudRouter("automation"));

module.exports = router;
