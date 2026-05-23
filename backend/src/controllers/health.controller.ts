import type { Request, Response } from 'express';

import { getHealth } from '../services/health.service.js';

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  const healthData = getHealth();
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: healthData,
  });
};
