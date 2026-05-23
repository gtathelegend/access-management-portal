import type { Request, Response } from 'express';

import { getHealth } from '../services/health.service.js';

export const healthCheck = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: getHealth(),
  });
};
