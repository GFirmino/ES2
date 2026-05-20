const express = require("express");
const AppError = require("../errors/AppError");
const { sendError, requireAuthAndRoles, auditOperation } = require("./route.helpers");
const {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require("../data/users.memory");

const router = express.Router();
const USER_ROLES = ["TECNICO", "RESPONSAVEL", "ADMIN"];

function validateUserPayload(payload, requirePassword = true) {
  const input = payload || {};

  if (typeof input.username !== "string" || input.username.trim().length === 0) {
    throw new AppError("Username e obrigatorio.", 400);
  }

  if (requirePassword && (typeof input.password !== "string" || input.password.trim().length === 0)) {
    throw new AppError("Password e obrigatoria.", 400);
  }

  if (input.role !== undefined && !USER_ROLES.includes(String(input.role).toUpperCase())) {
    throw new AppError("Role invalida.", 400);
  }

  return {
    ...input,
    username: input.username.trim(),
    role: input.role ? String(input.role).toUpperCase() : "TECNICO"
  };
}

router.get("/", ...requireAuthAndRoles(["ADMIN"]), (req, res) => {
  res.status(200).json({ data: listUsers() });
});

router.get("/:id", ...requireAuthAndRoles(["ADMIN"]), (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "Utilizador nao encontrado." });
  }

  return res.status(200).json({ data: user });
});

router.post("/", ...requireAuthAndRoles(["ADMIN"]), (req, res) => {
  try {
    const user = createUser(validateUserPayload(req.body));
    auditOperation(req, "CREATE_USER", "users", user.id);
    return res.status(201).json({ data: user });
  } catch (error) {
    return sendError(res, error);
  }
});

router.put("/:id", ...requireAuthAndRoles(["ADMIN"]), (req, res) => {
  let user;

  try {
    user = updateUser(req.params.id, validateUserPayload(req.body, false));
  } catch (error) {
    return sendError(res, error);
  }

  if (!user) {
    return res.status(404).json({ error: "Utilizador nao encontrado." });
  }

  auditOperation(req, "UPDATE_USER", "users", user.id);
  return res.status(200).json({ data: user });
});

router.delete("/:id", ...requireAuthAndRoles(["ADMIN"]), (req, res) => {
  const deleted = deleteUser(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: "Utilizador nao encontrado." });
  }

  auditOperation(req, "DELETE_USER", "users", Number(req.params.id));
  return res.status(204).send();
});

module.exports = router;
