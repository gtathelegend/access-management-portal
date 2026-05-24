import { Router } from 'express';

import { authRouter } from './auth.routes.js';
import { healthRouter } from './health.routes.js';
import { recordsRouter } from './records.routes.js';
import { usersRouter } from './users.routes.js';
import statsRouter from '../stats.routes.js';
import analyticsRouter from '../analytics.routes.js';

export const v1Router = Router();

v1Router.use(authRouter);
v1Router.use(healthRouter);
v1Router.use(recordsRouter);
v1Router.use(usersRouter);
v1Router.use('/stats', statsRouter);
v1Router.use('/analytics', analyticsRouter);
