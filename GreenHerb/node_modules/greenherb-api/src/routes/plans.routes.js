const express = require("express");
const createCrudRouter = require("./crud.routes.factory");
const { createItem } = require("../data/resources.memory");
const { createPlan } = require("../services/plans.service");

const router = express.Router();

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  const payload = {
    error: statusCode === 500 ? "Erro interno." : error.message
  };

  if (error.details) {
    payload.details = error.details;
  }

  return res.status(statusCode).json(payload);
}

router.post("/", (req, res) => {
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

    return res.status(201).json({ data: savedPlan });
  } catch (error) {
    return sendError(res, error);
  }
});

router.use(createCrudRouter("plans"));

module.exports = router;
