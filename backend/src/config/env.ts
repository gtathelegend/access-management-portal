import dotenv from 'dotenv';

dotenv.config();

export type NodeEnv = 'development' | 'test' | 'production';

export interface Env {
  nodeEnv: NodeEnv;
  port: number;
  mongoDbUri: string;
  corsOrigin?: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

const parseNodeEnv = (value: string | undefined): NodeEnv => {
  if (value === 'production' || value === 'test' || value === 'development') {
    return value;
  }
  return 'development';
};

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env: Env = {
  nodeEnv: parseNodeEnv(process.env.NODE_ENV),
  port: Number(process.env.PORT ?? 3000),
  mongoDbUri: requireEnv('MONGODB_URI'),
  corsOrigin: process.env.CORS_ORIGIN,
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
};
