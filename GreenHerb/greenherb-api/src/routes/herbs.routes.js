const express = require("express");
const AppError = require("../errors/AppError");
const createCrudRouter = require("./crud.routes.factory");
const { listItems, createItem } = require("../data/resources.memory");
const { importHerbsFromCsv } = require("../services/herbsImport.service");
const { sendError, requireAuthAndRoles, auditOperation } = require("./route.helpers");

const router = express.Router();

function requireNonEmptyString(payload, field) {
  if (typeof payload[field] !== "string" || payload[field].trim().length === 0) {
    throw new AppError(`${field} e obrigatorio.`, 400, { field });
  }

  return payload[field].trim();
}

function validateOptionalNumber(payload, field, min, max) {
  if (payload[field] === undefined || payload[field] === "") {
    return undefined;
  }

  if (typeof payload[field] !== "number" || !Number.isFinite(payload[field])) {
    throw new AppError(`${field} deve ser numerico.`, 400, { field });
  }

  if (payload[field] < min || payload[field] > max) {
    throw new AppError(`${field} fora do intervalo permitido.`, 400, { field, min, max });
  }

  return payload[field];
}

function validateHerbPayload(payload) {
  const input = payload || {};
  const herb = {
    commonName: requireNonEmptyString(input, "commonName"),
    scientificName: requireNonEmptyString(input, "scientificName")
  };

  const numericFields = [
    ["idealTemperatureMin", 18, 28],
    ["idealTemperatureMax", 18, 28],
    ["idealHumidityMin", 40, 80],
    ["idealHumidityMax", 40, 80],
    ["idealLuminosityMin", 5000, 25000],
    ["idealLuminosityMax", 5000, 25000],
    ["cycleDurationDays", 1, 365]
  ];

  numericFields.forEach(([field, min, max]) => {
    const value = validateOptionalNumber(input, field, min, max);

    if (value !== undefined) {
      herb[field] = value;
    }
  });

  if (
    typeof herb.idealTemperatureMin === "number" &&
    typeof herb.idealTemperatureMax === "number" &&
    herb.idealTemperatureMin > herb.idealTemperatureMax
  ) {
    throw new AppError("Temperatura minima nao pode exceder maxima.", 400);
  }

  return herb;
}

router.post(
  "/import",
  ...requireAuthAndRoles(["ADMIN", "RESPONSAVEL"]),
  express.text({ type: ["text/*", "text/csv"] }),
  (req, res) => {
    try {
      const csvContent = typeof req.body === "string" ? req.body : req.body && req.body.csvContent;
      const result = importHerbsFromCsv(csvContent, listItems("herbs"));

      result.imported = result.imported.map((herb) => createItem("herbs", herb));
      result.imported.forEach((herb) => auditOperation(req, "IMPORT_HERB", "herbs", herb.id));

      return res.status(201).json(result);
    } catch (error) {
      return sendError(res, error);
    }
  }
);

router.post("/", ...requireAuthAndRoles(["ADMIN", "RESPONSAVEL"]), (req, res) => {
  try {
    const herb = createItem("herbs", validateHerbPayload(req.body));
    auditOperation(req, "CREATE_HERB", "herbs", herb.id);
    return res.status(201).json({ data: herb });
  } catch (error) {
    return sendError(res, error);
  }
});

router.use(createCrudRouter("herbs"));

module.exports = router;
