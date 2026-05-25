import { connectDb, disconnectDb } from './config/db.js';
import { env } from './config/env.js';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';

const start = async (): Promise<void> => {
  await connectDb();

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info('server_started', {
      port: env.port,
      nodeEnv: env.nodeEnv,
    });
  });

  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;

  let shuttingDown = false;

  const shutdown = async (signal: string) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    logger.warn('shutdown_requested', { signal });

    server.close(async () => {
      try {
        await disconnectDb();
      } catch (err) {
        logger.error('shutdown_disconnect_failed', {
          err: err instanceof Error ? { name: err.name, message: err.message } : err,
        });
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