import { Router } from 'express';

import { getDashboardStats } from '../controllers/stats.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/', asyncHandler(getDashboardStats));

export default router;