import { Request, Response, NextFunction } from "express";
import AppError from "@/lib/AppError.js";
import HttpStatusCode from "@/lib/HttpStatusCode.js";

/* 404 Not Found Middleware */
const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError({
    status: HttpStatusCode.NOT_FOUND,
    type: "NotFound",
    message: `Cannot find ${req.originalUrl} on this server`,
    highlight: "url",
  });
  next(error);
};

export default notFoundHandler;
