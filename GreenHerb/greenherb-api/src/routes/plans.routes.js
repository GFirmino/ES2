const express = require("express");
const createCrudRouter = require("./crud.routes.factory");
const { createItem } = require("../data/resources.memory");
const { createPlan } = require("../services/plans.service");
const { sendError, requireAuthAndRoles, auditOperation } = require("./route.helpers");

const router = express.Router();

router.post("/", ...requireAuthAndRoles(["RESPONSAVEL", "ADMIN"]), (req, res) => {
  try {
    const body = req.body || {};
    const {
      options,
      hasResponsibleAuthorization,
      authorizedByRole,
      plan,
      ...planFields
    } = body;

    const planInput = plan || planFields;
    const authorizationOptions =
      options || {
        hasResponsibleAuthorization,
        authorizedByRole
      };

    const validatedPlan = createPlan(planInput, authorizationOptions);
    const savedPlan = createItem("plans", validatedPlan);

    auditOperation(req, "CREATE_PLAN", "plans", savedPlan.id);
    return res.status(201).json({ data: savedPlan });
  } catch (error) {
    return sendError(res, error);
  }
});

router.use(createCrudRouter("plans"));

module.exports = router;
