const users = [
  {
    id: 1,
    username: "tecnico",
    password: "Tecnico123!",
    role: "TECNICO"
  },
  {
    id: 2,
    username: "responsavel",
    password: "Responsavel123!",
    role: "RESPONSAVEL"
  },
  {
    id: 3,
    username: "admin",
    password: "Admin123!",
    role: "ADMIN"
  }
];

let nextUserId = users.length + 1;

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

function listUsers() {
  return users.map(sanitizeUser);
}

function getUserById(id) {
  const numericId = Number(id);
  return sanitizeUser(users.find((user) => user.id === numericId));
}

function findUserByUsername(username) {
  return users.find((user) => user.username === username);
}

function createUser(payload) {
  const user = {
    id: nextUserId,
    username: payload.username,
    password: payload.password,
    role: payload.role || "TECNICO"
  };

  nextUserId += 1;
  users.push(user);

  return sanitizeUser(user);
}

function updateUser(id, payload) {
  const numericId = Number(id);
  const index = users.findIndex((user) => user.id === numericId);

  if (index === -1) {
    return null;
  }

  users[index] = {
    ...users[index],
    ...payload,
    id: numericId
  };

  return sanitizeUser(users[index]);
}

function deleteUser(id) {
  const numericId = Number(id);
  const index = users.findIndex((user) => user.id === numericId);

  if (index === -1) {
    return false;
  }

  users.splice(index, 1);
  return true;
}

module.exports = {
  users,
  sanitizeUser,
  listUsers,
  getUserById,
  findUserByUsername,
  createUser,
  updateUser,
  deleteUser
};
