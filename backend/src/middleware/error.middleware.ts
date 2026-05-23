import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../utils/app-error.js';
import { logger } from '../utils/logger.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const normalized = err instanceof AppError ? err : new AppError('Internal server error', 500, false);

  if (!(err instanceof AppError)) {
    logger.error('Unhandled error', {
      err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
    });
  }

  res.status(normalized.statusCode).json({
    success: false,
    message: normalized.message,
  });
};
