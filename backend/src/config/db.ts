import mongoose from 'mongoose';

import { env } from './env.js';
import { logger } from '../utils/logger.js';

export const connectDb = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  if (env.nodeEnv === 'production') {
    mongoose.set('autoIndex', false);
  }

  logger.info('db_connecting', {
    nodeEnv: env.nodeEnv,
    uriHost: new URL(env.mongoDbUri).host,
  });

  try {
    await mongoose.connect(env.mongoDbUri, {
      serverSelectionTimeoutMS: 10_000,
      maxPoolSize: 10,
    });

    logger.info('db_connected', {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
  } catch (err) {
    logger.error('db_connection_failed', {
      err: err instanceof Error ? { name: err.name, message: err.message } : err,
    });
    throw err;
  }
};

export const disconnectDb = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('db_disconnected');
  } catch (err) {
    logger.error('db_disconnect_failed', {
      err: err instanceof Error ? { name: err.name, message: err.message } : err,
    });
    throw err;
  }
};
