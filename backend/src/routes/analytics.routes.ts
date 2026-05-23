import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/dashboard-stats', analyticsController.getDashboardStats);

export default router;
