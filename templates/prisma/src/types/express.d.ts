import "express";

declare module "express" {
  interface Request {
    user?: {
      id: number;
      email: string;
      jti: string;
      exp: number;
    };
  }
  interface ErrorResponse {
    success: false;
    error: {
      type: string;
      message: string;
      highlight: string;
      details?: unknown;
    };
  }
  interface SuccessResponse {
    success: true;
    message: string;
    data: object;
    details?: unknown;
  }
}
