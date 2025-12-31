export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class PasteExpiredError extends AppError {
  constructor(message: string = "Paste has expired") {
    super(message, 404, "PASTE_EXPIRED");
    this.name = "PasteExpiredError";
  }
}

export class ViewLimitExceededError extends AppError {
  constructor(message: string = "View limit exceeded") {
    super(message, 404, "VIEW_LIMIT_EXCEEDED");
    this.name = "ViewLimitExceededError";
  }
}
