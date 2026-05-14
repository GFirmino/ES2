class AppError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;

    if (details) {
      this.details = details;
    }
  }
}

module.exports = AppError;
