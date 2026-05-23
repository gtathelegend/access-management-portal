import mongoose from 'mongoose';

import { logger } from '../utils/logger.js';

export const connectDb = async (mongoDbUri: string): Promise<void> => {
  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoDbUri);
  logger.info('MongoDB connected', {
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  });
};

export const disconnectDb = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};
