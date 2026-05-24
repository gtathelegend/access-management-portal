import dotenv from 'dotenv';

dotenv.config();

export type NodeEnv = 'development' | 'test' | 'production';

export interface Env {
  nodeEnv: NodeEnv;
  port: number;
  mongoDbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientUrl: string;
  bcryptSaltRounds: number;
}

const parseNodeEnv = (value: string | undefined): NodeEnv => {
  if (value === 'production' || value === 'test' || value === 'development') {
    return value;
  }

  throw new Error('Missing or invalid environment variable: NODE_ENV');
};

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value.trim();
};

const parsePort = (value: string | undefined): number => {
  const raw = value?.trim();
  if (!raw) {
    throw new Error('Missing required environment variable: PORT');
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error('Environment variable PORT must be a positive integer');
  }

  return parsed;
};

const parseBcryptSaltRounds = (value: string | undefined): number => {
  if (!value?.trim()) {
    return 12;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 4) {
    throw new Error('Environment variable BCRYPT_SALT_ROUNDS must be a whole number greater than or equal to 4');
  }

  return parsed;
};

export const env: Env = {
  nodeEnv: parseNodeEnv(process.env.NODE_ENV),
  port: parsePort(process.env.PORT),
  mongoDbUri: requireEnv('MONGODB_URI'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: requireEnv('JWT_EXPIRES_IN'),
  clientUrl: requireEnv('CLIENT_URL'),
  bcryptSaltRounds: parseBcryptSaltRounds(process.env.BCRYPT_SALT_ROUNDS),
};
