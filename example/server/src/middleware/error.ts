import { NextFunction, Request, Response } from "express";

type ExpressError = Error & {
  status?: number;
};

const createError = (message: string, status: number): ExpressError => {
  const error: ExpressError = new Error(message);
  error.status = status;

  return error;
};

const createNotFoundError = (message: string = "Resource not found"): ExpressError =>
  createError(message, 404);

const createBadRequestError = (message: string = "Bad request"): ExpressError =>
  createError(message, 400);

const createAuthError = (message: string = "Not authenticated"): ExpressError =>
  createError(message, 403);

const errorHandler = (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err.stack);

  const { message = "Unhandled error", status = 500 } = err;
  res.status(status).json({ status, message });
};

const notFoundErrorHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(createNotFoundError());
};

export {
  createError,
  createNotFoundError,
  createBadRequestError,
  createAuthError,
  errorHandler,
  notFoundErrorHandler,
};
