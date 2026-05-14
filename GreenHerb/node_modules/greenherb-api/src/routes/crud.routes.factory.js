const express = require("express");
const {
  listItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require("../data/resources.memory");

function createCrudRouter(resourceName) {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.status(200).json({ data: listItems(resourceName) });
  });

  router.get("/:id", (req, res) => {
    const item = getItemById(resourceName, req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Recurso nao encontrado." });
    }

    return res.status(200).json({ data: item });
  });

  router.post("/", (req, res) => {
    const item = createItem(resourceName, req.body || {});
    res.status(201).json({ data: item });
  });

  router.put("/:id", (req, res) => {
    const item = updateItem(resourceName, req.params.id, req.body || {});

    if (!item) {
      return res.status(404).json({ error: "Recurso nao encontrado." });
    }

    return res.status(200).json({ data: item });
  });

  router.delete("/:id", (req, res) => {
    const deleted = deleteItem(resourceName, req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Recurso nao encontrado." });
    }

    return res.status(204).send();
  });

  return router;
}

module.exports = createCrudRouter;
