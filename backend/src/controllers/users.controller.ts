import type { Request, Response } from 'express';

import { AppError } from '../utils/app-error.js';
import { createUser, deleteUser, listUsers, updateUser } from '../services/users.service.js';
import type { UserRole, UserStatus } from '../models/user.model.js';

interface CreateUserBody {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  role?: unknown;
  status?: unknown;
}

interface UpdateUserBody {
  name?: unknown;
  email?: unknown;
  role?: unknown;
  status?: unknown;
}

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const parseRole = (value: unknown): UserRole | undefined => {
  if (value === 'admin' || value === 'user') return value;
  return undefined;
};

const parseStatus = (value: unknown): UserStatus | undefined => {
  if (value === 'active' || value === 'disabled') return value;
  return undefined;
};

const requireAdminAuth = (req: Request) => {
  if (!req.auth) {
    throw new AppError('Unauthorized', 401);
  }
  if (req.auth.role !== 'admin') {
    throw new AppError('Forbidden', 403);
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  requireAdminAuth(req);

  const page = Math.max(1, Math.floor(parseNumber(req.query.page) ?? 1));
  const limit = Math.min(100, Math.max(1, Math.floor(parseNumber(req.query.limit) ?? 20)));

  const role = parseRole(req.query.role);
  const status = parseStatus(req.query.status);
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;

  const result = await listUsers({
    page,
    limit,
    filters: {
      role,
      status,
      q,
    },
  });

  res.status(200).json(result);
};

export const postUser = async (req: Request, res: Response): Promise<void> => {
  requireAdminAuth(req);

  const body = req.body as CreateUserBody;

  if (typeof body.name !== 'string' || body.name.trim().length < 2) {
    throw new AppError('Name is required', 400);
  }

  if (typeof body.email !== 'string' || body.email.trim().length < 3) {
    throw new AppError('Email is required', 400);
  }

  if (typeof body.password !== 'string' || body.password.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  const role = parseRole(body.role);
  if (body.role !== undefined && !role) {
    throw new AppError('Role must be admin or user', 400);
  }

  const status = parseStatus(body.status);
  if (body.status !== undefined && !status) {
    throw new AppError('Status must be active or disabled', 400);
  }

  const user = await createUser({
    name: body.name.trim(),
    email: body.email.trim(),
    password: body.password,
    role,
    status,
  });

  res.status(201).json(user);
};

export const putUser = async (req: Request, res: Response): Promise<void> => {
  requireAdminAuth(req);

  const body = req.body as UpdateUserBody;

  const update: {
    name?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
  } = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2) {
      throw new AppError('Name must be at least 2 characters', 400);
    }
    update.name = body.name.trim();
  }

  if (body.email !== undefined) {
    if (typeof body.email !== 'string' || body.email.trim().length < 3) {
      throw new AppError('Email is invalid', 400);
    }
    update.email = body.email.trim();
  }

  if (body.role !== undefined) {
    const role = parseRole(body.role);
    if (!role) {
      throw new AppError('Role must be admin or user', 400);
    }
    update.role = role;
  }

  if (body.status !== undefined) {
    const status = parseStatus(body.status);
    if (!status) {
      throw new AppError('Status must be active or disabled', 400);
    }
    update.status = status;
  }

  if (Object.keys(update).length === 0) {
    throw new AppError('No fields to update', 400);
  }

  const user = await updateUser(req.params.id, update);
  res.status(200).json(user);
};

export const removeUser = async (req: Request, res: Response): Promise<void> => {
  requireAdminAuth(req);

  await deleteUser(req.params.id);
  res.status(204).send();
};
