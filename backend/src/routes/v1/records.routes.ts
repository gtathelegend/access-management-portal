import { Router } from 'express';

import { getRecord, getRecords } from '../../controllers/records.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';

export const recordsRouter = Router();

recordsRouter.use(requireAuth);

recordsRouter.get('/records', asyncHandler(getRecords));
recordsRouter.get('/records/:id', asyncHandler(getRecord));
