import type { Request, Response } from 'express';

import { AppError } from '../utils/app-error.js';
import { loginWithEmailPassword } from '../services/auth.service.js';

interface LoginBody {
  email?: unknown;
  password?: unknown;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as LoginBody;

  if (typeof body.email !== 'string' || typeof body.password !== 'string') {
    throw new AppError('Email and password are required', 400);
  }

  const email = body.email.trim();
  const password = body.password;

  if (!email || password.length < 1) {
    throw new AppError('Email and password are required', 400);
  }

  const result = await loginWithEmailPassword({ email, password });

  res.status(200).json(result);
};
