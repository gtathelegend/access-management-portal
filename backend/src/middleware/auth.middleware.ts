import type { NextFunction, Request, Response } from 'express';
import jsonwebtoken, { type JwtPayload } from 'jsonwebtoken';

import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

export type AuthRole = 'admin' | 'user';

export interface AuthContext {
  userId: string;
  role: AuthRole;
}

interface AuthJwtPayload extends JwtPayload {
  sub?: string;
  role?: AuthRole;
}

const getBearerToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token.trim();
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = getBearerToken(req);
  if (!token) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  try {
    const decoded = jsonwebtoken.verify(token, env.jwtSecret) as AuthJwtPayload;

    const userId = decoded.sub;
    const role = decoded.role;

    if (!userId || (role !== 'admin' && role !== 'user')) {
      next(new AppError('Unauthorized', 401));
      return;
    }

    req.auth = { userId, role };
    next();
  } catch {
    next(new AppError('Unauthorized', 401));
  }
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.auth) {
    next(new AppError('Unauthorized', 401));
    return;
  }

  if (req.auth.role !== 'admin') {
    next(new AppError('Forbidden', 403));
    return;
  }

  next();
};
