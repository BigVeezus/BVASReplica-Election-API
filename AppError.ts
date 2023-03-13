class AppError extends Error {
  constructor(message: any, status: any) {
    super();
    this.message = this.message;
    status = status;
  }
}

module.exports = AppError;
