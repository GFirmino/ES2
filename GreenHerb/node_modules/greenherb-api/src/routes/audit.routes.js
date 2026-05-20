const express = require("express");
const createCrudRouter = require("./crud.routes.factory");
const { listItems } = require("../data/resources.memory");
const { requireAuthAndRoles } = require("./route.helpers");

const router = express.Router();

router.get("/", ...requireAuthAndRoles(["ADMIN"]), (req, res) => {
  res.status(200).json({ data: listItems("audit") });
});

router.use(createCrudRouter("audit"));

module.exports = router;
