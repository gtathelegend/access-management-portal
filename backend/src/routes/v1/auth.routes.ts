import { Router } from 'express';

import { login } from '../../controllers/auth.controller.js';
import { loginRateLimiter } from '../../middleware/auth-rate-limit.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';

export const authRouter = Router();

authRouter.post('/auth/login', loginRateLimiter, asyncHandler(login));
