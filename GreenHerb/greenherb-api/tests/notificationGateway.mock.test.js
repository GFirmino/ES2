const NotificationGatewayMock = require("../src/gateways/mocks/NotificationGatewayMock");

function createNotification(overrides = {}) {
  return {
    recipientRole: "RESPONSAVEL",
    type: "TEMPERATURE_ALERT",
    message: "Temperatura fora dos limites",
    payload: {
      batchId: 1,
      temperature: 29
    },
    ...overrides
  };
}

describe("NotificationGatewayMock - Sprint 6", () => {
  test("TD-NOTIF-01: mock regista uma notificacao enviada", async () => {
    const mock = new NotificationGatewayMock();

    await mock.sendNotification(createNotification());

    expect(mock.getCallCount()).toBe(1);
    expect(mock.getLastNotification()).toMatchObject({
      type: "TEMPERATURE_ALERT",
      message: "Temperatura fora dos limites",
      payload: {
        batchId: 1,
        temperature: 29
      }
    });
  });

  test("TD-NOTIF-02: mock regista multiplas notificacoes", async () => {
    const mock = new NotificationGatewayMock();

    await mock.sendNotification(createNotification({ message: "Primeira notificacao" }));
    await mock.sendNotification(createNotification({ message: "Segunda notificacao" }));

    expect(mock.getCallCount()).toBe(2);
    expect(mock.getNotifications()).toHaveLength(2);
    expect(mock.getNotifications()[0].message).toBe("Primeira notificacao");
    expect(mock.getNotifications()[1].message).toBe("Segunda notificacao");
  });

  test("TD-NOTIF-03: mock limpa chamadas entre testes", async () => {
    const mock = new NotificationGatewayMock();

    await mock.sendNotification(createNotification());
    mock.clear();

    expect(mock.getCallCount()).toBe(0);
    expect(mock.getLastNotification()).toBeNull();
  });

  test("TD-NOTIF-04: mock permite verificar destinatario", async () => {
    const mock = new NotificationGatewayMock();

    await mock.sendNotification(createNotification({ recipientRole: "RESPONSAVEL" }));

    expect(mock.getLastNotification().recipientRole).toBe("RESPONSAVEL");
  });
});
