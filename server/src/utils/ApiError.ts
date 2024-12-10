import { ErrorCode } from "../constants";


class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errorCode: ErrorCode;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errorCode: ErrorCode
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errorCode = errorCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };