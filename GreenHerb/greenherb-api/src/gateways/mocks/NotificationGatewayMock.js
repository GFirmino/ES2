const NotificationGateway = require("../NotificationGateway");

function cloneNotification(notification) {
  return {
    ...notification,
    payload: notification && notification.payload ? { ...notification.payload } : undefined
  };
}

class NotificationGatewayMock extends NotificationGateway {
  constructor() {
    super();
    this.notifications = [];
  }

  async sendNotification(notification) {
    const storedNotification = cloneNotification(notification);
    this.notifications.push(storedNotification);

    return {
      sent: true,
      notification: storedNotification
    };
  }

  getCallCount() {
    return this.notifications.length;
  }

  getLastNotification() {
    return this.notifications[this.notifications.length - 1] || null;
  }

  getNotifications() {
    return [...this.notifications];
  }

  clear() {
    this.notifications = [];
  }
}

module.exports = NotificationGatewayMock;
