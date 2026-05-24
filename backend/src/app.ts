import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';
import { delayFromQuery } from './middleware/delay.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { requestSanitizer } from './middleware/request-sanitizer.middleware.js';
import { requestLogger } from './middleware/request-logger.middleware.js';
import { v1Router } from './routes/v1/index.js';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));
  app.use(requestSanitizer);
  app.use(requestLogger);

  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Access Management Portal API',
    });
  });

  app.get('/health', (_req, res) => {
    res.status(200).send('OK');
  });

  app.get('/ping', (_req, res) => {
    res.status(204).end();
  });

  app.use('/api/v1', delayFromQuery({ maxMs: 30_000 }), v1Router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
