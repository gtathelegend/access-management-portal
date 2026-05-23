import { connectDb, disconnectDb } from './config/db.js';
import { env } from './config/env.js';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';

const start = async (): Promise<void> => {
  await connectDb(env.mongoDbUri);

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info('server_started', {
      port: env.port,
      nodeEnv: env.nodeEnv,
    });
  });

  const shutdown = async (signal: string) => {
    logger.warn('shutdown', { signal });

    server.close(async () => {
      try {
        await disconnectDb();
      } finally {
        process.exit(0);
      }
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
};

start().catch((err) => {
  logger.error('startup_failed', {
    err: err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err,
  });
  process.exit(1);
});
