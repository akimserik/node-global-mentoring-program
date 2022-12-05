import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import logger from "./logger";

export class DataError extends Error {
  statusCode?: number;

  constructor(message?: string, statusCode?: number) {
    super(message);
    this.name = "DataError";
    this.statusCode = statusCode;
  }
}

export class AuthError extends Error {
  statusCode?: number;

  constructor(message?: string, statusCode?: number) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = statusCode;
  }
}

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); // handle error with globalErrorHandler
  };
};

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  const { originalUrl, method, body } = req;

  const appErr = {
    method,
    originalUrl,
    parameters: JSON.stringify(body) || "",
    message: err.message || "INTERNAL SERVER ERROR",
  };

  logger.error(JSON.stringify(appErr));
  res.status(err.statusCode || 500).json(appErr);
};
