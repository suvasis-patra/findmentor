export class ApiResponse<T> {
      statusCode: number;
      success: boolean;
      data: T;
      message: string;
      constructor(statusCode: number, data: T, message: string) {
        this.statusCode = statusCode;
        this.success = true;
        this.data = data;
        this.message = message;
      }
    }