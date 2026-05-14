const authService = require("../services/auth.service");

function login(req, res) {
  const result = authService.authenticate(req.body);

  if (result.status !== 200) {
    return res.status(result.status).json({ error: result.error });
  }

  return res.status(200).json({
    user: result.user,
    token: result.token
  });
}

function refresh(req, res) {
  const authorizationHeader = req.headers && req.headers.authorization;
  const bearerToken =
    typeof authorizationHeader === "string" && authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.slice(7)
      : undefined;
  const bodyToken = req.body && req.body.token;

  const result = authService.refreshToken(bodyToken || bearerToken);

  if (result.status !== 200) {
    return res.status(result.status).json({ error: result.error });
  }

  return res.status(200).json({
    user: result.user,
    token: result.token
  });
}

module.exports = {
  login,
  refresh
};
