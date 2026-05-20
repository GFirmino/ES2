const AppError = require("../errors/AppError");

const KNOWN_ROLES = ["TECNICO", "RESPONSAVEL", "ADMIN"];

function normalizeRole(role) {
  return typeof role === "string" ? role.trim().toUpperCase() : null;
}

function authorizeRole(user, allowedRoles) {
  if (!user) {
    throw new AppError("Utilizador nao autenticado.", 401);
  }

  const role = normalizeRole(user.role);

  if (!role) {
    throw new AppError("Perfil de utilizador em falta.", 401);
  }

  const normalizedAllowedRoles = (allowedRoles || []).map(normalizeRole);

  if (!KNOWN_ROLES.includes(role) || !normalizedAllowedRoles.includes(role)) {
    throw new AppError("Acesso negado.", 403);
  }

  return {
    authorized: true,
    role
  };
}

module.exports = {
  authorizeRole
};
