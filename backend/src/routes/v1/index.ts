import { Router } from 'express';

import { authRouter } from './auth.routes.js';
import { healthRouter } from './health.routes.js';

export const v1Router = Router();

v1Router.use(authRouter);
v1Router.use(healthRouter);
