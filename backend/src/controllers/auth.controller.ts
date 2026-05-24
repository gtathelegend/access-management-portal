import type { Request, Response } from 'express';

import { AppError } from '../utils/app-error.js';
import { loginWithEmailPassword } from '../services/auth.service.js';

const isAuthRole = (value: string): value is 'admin' | 'user' => value === 'admin' || value === 'user';

interface LoginBody {
  email?: unknown;
  password?: unknown;
  role?: unknown;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as LoginBody;

  if (typeof body.email !== 'string' || typeof body.password !== 'string' || typeof body.role !== 'string') {
    throw new AppError('Email, password, and role are required', 400);
  }

  const email = body.email.trim();
  const password = body.password;
  const role = body.role.trim();

  if (!email || password.length < 1 || !role) {
    throw new AppError('Email, password, and role are required', 400);
  }

  if (!isAuthRole(role)) {
    throw new AppError('Role must be admin or user', 400);
  }

  const result = await loginWithEmailPassword({ email, password, role });

  res.status(200).json(result);
};
