type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const nowIso = () => new Date().toISOString();

export const logger = {
  log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const payload = {
      ts: nowIso(),
      level,
      message,
      ...(meta ? { meta } : {}),
    };

    // Keep it simple and JSON-friendly for aggregators.
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](JSON.stringify(payload));
  },

  debug(message: string, meta?: Record<string, unknown>) {
    this.log('debug', message, meta);
  },
  info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
  },
  warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
  },
  error(message: string, meta?: Record<string, unknown>) {
    this.log('error', message, meta);
  },
};
