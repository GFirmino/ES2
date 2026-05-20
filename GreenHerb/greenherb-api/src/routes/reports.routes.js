const express = require("express");
const AppError = require("../errors/AppError");
const createCrudRouter = require("./crud.routes.factory");
const { listItems } = require("../data/resources.memory");
const { generateCsvReport } = require("../services/reports.service");
const { sendError, requireAuthAndRoles, auditOperation } = require("./route.helpers");

const router = express.Router();

router.get("/", ...requireAuthAndRoles(["ADMIN"]), (req, res) => {
  try {
    const format = req.query.format || "csv";

    if (format !== "csv") {
      throw new AppError("Formato de relatorio nao suportado.", 400);
    }

    const records = listItems("batches").map((batch) => ({
      id: batch.id,
      herbId: batch.herbId,
      planId: batch.planId,
      state: batch.state || batch.status || "",
      expectedUnits: batch.expectedUnits || ""
    }));
    const csv = generateCsvReport(records, ["id", "herbId", "planId", "state", "expectedUnits"]);

    auditOperation(req, "EXPORT_REPORT_CSV", "reports", null);
    return res.status(200).type("text/csv").send(csv);
  } catch (error) {
    return sendError(res, error);
  }
});

router.use(createCrudRouter("reports"));

module.exports = router;
