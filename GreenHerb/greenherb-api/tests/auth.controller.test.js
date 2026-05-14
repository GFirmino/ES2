const { login } = require("../src/controllers/auth.controller");

function createMockResponse() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function executeLogin(body) {
  const req = { body };
  const res = createMockResponse();

  login(req, res);

  return res;
}

function expectStatus(res, statusCode) {
  expect(res.status).toHaveBeenCalledWith(statusCode);
}

describe("Auth controller - login", () => {
  test("TU-AUTH-01: username valido + password valida devolve 200, token e user sem password", () => {
    const res = executeLogin({
      username: "tecnico",
      password: "Tecnico123!"
    });

    expectStatus(res, 200);

    const payload = res.json.mock.calls[0][0];
    expect(payload.token).toBeDefined();
    expect(typeof payload.token).toBe("string");
    expect(payload.user).toMatchObject({
      id: 1,
      username: "tecnico",
      role: "TECNICO"
    });
    expect(payload.user.password).toBeUndefined();
  });

  test("TU-AUTH-02: username inexistente + password valida devolve 401", () => {
    const res = executeLogin({
      username: "naoexiste",
      password: "Tecnico123!"
    });

    expectStatus(res, 401);
  });

  test("TU-AUTH-03: username valido + password incorreta devolve 401", () => {
    const res = executeLogin({
      username: "tecnico",
      password: "Errada123!"
    });

    expectStatus(res, 401);
  });

  test("TU-AUTH-04: username vazio + password valida devolve 400", () => {
    const res = executeLogin({
      username: "",
      password: "Tecnico123!"
    });

    expectStatus(res, 400);
  });

  test("TU-AUTH-05: username valido + password vazia devolve 400", () => {
    const res = executeLogin({
      username: "tecnico",
      password: ""
    });

    expectStatus(res, 400);
  });

  test("TU-AUTH-06: username em falta devolve 400", () => {
    const res = executeLogin({
      password: "Tecnico123!"
    });

    expectStatus(res, 400);
  });

  test("TU-AUTH-07: password em falta devolve 400", () => {
    const res = executeLogin({
      username: "tecnico"
    });

    expectStatus(res, 400);
  });

  test("TU-AUTH-08: username e password em falta devolve 400", () => {
    const res = executeLogin({});

    expectStatus(res, 400);
  });

  test("TU-AUTH-09: username nao string devolve 400", () => {
    const res = executeLogin({
      username: 123,
      password: "Tecnico123!"
    });

    expectStatus(res, 400);
  });

  test("TU-AUTH-10: password nao string devolve 400", () => {
    const res = executeLogin({
      username: "tecnico",
      password: 123
    });

    expectStatus(res, 400);
  });

  test("TU-AUTH-11: username apenas com espacos devolve 400", () => {
    const res = executeLogin({
      username: "   ",
      password: "Tecnico123!"
    });

    expectStatus(res, 400);
  });

  test("TU-AUTH-12: password apenas com espacos devolve 400", () => {
    const res = executeLogin({
      username: "tecnico",
      password: "   "
    });

    expectStatus(res, 400);
  });
});
