const NotificationGateway = require("./NotificationGateway");

class InMemoryNotificationGateway extends NotificationGateway {
  constructor() {
    super();
    this.notifications = [];
  }

  async sendNotification(notification) {
    this.notifications.push(notification);

    return {
      sent: true,
      notification
    };
  }

  getNotifications() {
    return [...this.notifications];
  }
}

module.exports = InMemoryNotificationGateway;
