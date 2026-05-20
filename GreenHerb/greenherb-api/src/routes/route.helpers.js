const authMiddleware = require("../middleware/auth.middleware");
const { authorizeRole } = require("../services/accessControl.service");
const { createAuditEntry } = require("../services/audit.service");
const { createItem } = require("../data/resources.memory");

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

function requireRoles(allowedRoles) {
  return (req, res, next) => {
    try {
      authorizeRole(req.user, allowedRoles);
      return next();
    } catch (error) {
      return sendError(res, error);
    }
  };
}

function requireAuthAndRoles(allowedRoles) {
  return [authMiddleware, requireRoles(allowedRoles)];
}

function auditOperation(req, action, resource, resourceId) {
  if (!req.user) {
    return null;
  }

  return createItem(
    "audit",
    createAuditEntry({
      userId: req.user.sub,
      action,
      resource,
      resourceId
    })
  );
}

module.exports = {
  sendError,
  requireAuthAndRoles,
  auditOperation
};
