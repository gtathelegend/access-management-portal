import jsonwebtoken, { type SignOptions } from 'jsonwebtoken';

import { AppError } from '../utils/app-error.js';
import { env } from '../config/env.js';
import { UserModel } from '../models/user.model.js';

export interface LoginInput {
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface AuthenticatedUserDto {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginResult {
  token: string;
  user: AuthenticatedUserDto;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const loginWithEmailPassword = async (input: LoginInput): Promise<LoginResult> => {
  const email = normalizeEmail(input.email);

  const user = await UserModel.findOne({ email }).select('+password');

  // Do not leak which field was wrong.
  const invalidCredentials = new AppError('Invalid email or password', 401);

  if (!user) {
    throw invalidCredentials;
  }

  if (user.status !== 'active') {
    // Avoid user enumeration by returning the same message.
    throw invalidCredentials;
  }

  const ok = await user.comparePassword(input.password);
  if (!ok) {
    throw invalidCredentials;
  }

  if (user.role !== input.role) {
    throw new AppError('Selected role does not match assigned permissions', 403);
  }

  const signOptions: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };

  const token = jsonwebtoken.sign(
    {
      sub: user.id,
      id: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    signOptions,
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
