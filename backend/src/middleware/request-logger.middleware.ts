import type { NextFunction, Request, Response } from 'express';

import { logger } from '../utils/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    logger.info('request', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs),
      userAgent: req.get('user-agent'),
    });
  });

  next();
};
