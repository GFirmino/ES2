const jwt = require("jsonwebtoken");
const { findUserByUsername, sanitizeUser } = require("../data/users.memory");

const JWT_SECRET = process.env.JWT_SECRET || "greenherb-sprint1-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

function validateCredentials(credentials) {
  const body = credentials || {};
  const { username, password } = body;

  if (username === undefined && password === undefined) {
    return "Username e password sao obrigatorios.";
  }

  if (username === undefined) {
    return "Username e obrigatorio.";
  }

  if (password === undefined) {
    return "Password e obrigatoria.";
  }

  if (typeof username !== "string") {
    return "Username deve ser uma string.";
  }

  if (typeof password !== "string") {
    return "Password deve ser uma string.";
  }

  if (username.length === 0) {
    return "Username nao pode estar vazio.";
  }

  if (password.length === 0) {
    return "Password nao pode estar vazia.";
  }

  if (username.trim().length === 0) {
    return "Username nao pode conter apenas espacos.";
  }

  if (password.trim().length === 0) {
    return "Password nao pode conter apenas espacos.";
  }

  return null;
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function authenticate(credentials) {
  const validationError = validateCredentials(credentials);

  if (validationError) {
    return {
      status: 400,
      error: validationError
    };
  }

  const username = credentials.username.trim();
  const user = findUserByUsername(username);

  if (!user || user.password !== credentials.password) {
    return {
      status: 401,
      error: "Credenciais invalidas."
    };
  }

  return {
    status: 200,
    user: sanitizeUser(user),
    token: createToken(user)
  };
}

function refreshToken(token) {
  if (typeof token !== "string" || token.trim().length === 0) {
    return {
      status: 401,
      error: "Token e obrigatorio."
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findUserByUsername(decoded.username);

    if (!user) {
      return {
        status: 401,
        error: "Token invalido."
      };
    }

    return {
      status: 200,
      user: sanitizeUser(user),
      token: createToken(user)
    };
  } catch (error) {
    return {
      status: 401,
      error: "Token invalido."
    };
  }
}

module.exports = {
  authenticate,
  refreshToken
};
