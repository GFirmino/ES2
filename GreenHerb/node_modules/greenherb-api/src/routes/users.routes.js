const express = require("express");
const {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require("../data/users.memory");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ data: listUsers() });
});

router.get("/:id", (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "Utilizador nao encontrado." });
  }

  return res.status(200).json({ data: user });
});

router.post("/", (req, res) => {
  const user = createUser(req.body || {});
  res.status(201).json({ data: user });
});

router.put("/:id", (req, res) => {
  const user = updateUser(req.params.id, req.body || {});

  if (!user) {
    return res.status(404).json({ error: "Utilizador nao encontrado." });
  }

  return res.status(200).json({ data: user });
});

router.delete("/:id", (req, res) => {
  const deleted = deleteUser(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: "Utilizador nao encontrado." });
  }

  return res.status(204).send();
});

module.exports = router;
