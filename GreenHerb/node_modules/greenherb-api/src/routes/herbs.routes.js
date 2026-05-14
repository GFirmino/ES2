const express = require("express");
const createCrudRouter = require("./crud.routes.factory");
const { listItems, createItem } = require("../data/resources.memory");
const { importHerbsFromCsv } = require("../services/herbsImport.service");

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

router.post("/import", express.text({ type: ["text/*", "text/csv"] }), (req, res) => {
  try {
    const csvContent = typeof req.body === "string" ? req.body : req.body && req.body.csvContent;
    const result = importHerbsFromCsv(csvContent, listItems("herbs"));

    result.imported = result.imported.map((herb) => createItem("herbs", herb));

    return res.status(201).json(result);
  } catch (error) {
    return sendError(res, error);
  }
});

router.use(createCrudRouter("herbs"));

module.exports = router;
