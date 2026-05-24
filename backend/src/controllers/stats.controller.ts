import type { Request, Response } from 'express';

import { statsService } from '../services/stats.service.js';

export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  const data = await statsService.getDashboardStats();

  res.status(200).json({
    success: true,
    statusCode: 200,
    data,
  });
};