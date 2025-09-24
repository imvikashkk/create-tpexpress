import { Request, Response, NextFunction, ErrorResponse } from "express";
import AppError from "@/lib/AppError.js";

const globalErrorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;
  const error = {
    type: err.type || "InternalServerError",
    message: err.message || "Something went wrong",
    highlight: err.highlight || "",
    details: err.details || undefined,
  };

  const responseBody: ErrorResponse = {
    success: false,
    error,
  };

  console.error(error);

  res.status(status).json(responseBody);
};

export default globalErrorHandler;
