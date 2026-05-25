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
  const corsOptions = {
    origin: env.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    optionsSuccessStatus: 200,
  };

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

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
    res.status(200).json({
      status: 'ok',
      message: 'Access Management Portal API running',
    });
  });

  app.get('/ping', (_req, res) => {
    res.status(204).end();
  });

  app.use('/api/v1', delayFromQuery({ maxMs: 30_000 }), v1Router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
