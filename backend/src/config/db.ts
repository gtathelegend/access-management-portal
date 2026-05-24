import mongoose from 'mongoose';

import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDb = async (): Promise<void> => {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongoDbUri);
  logger.info('MongoDB connected', {
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  });
};

export const disconnectDb = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};
