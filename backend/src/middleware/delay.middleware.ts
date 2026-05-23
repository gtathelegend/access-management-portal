import type { RequestHandler } from 'express';

type ApiDelayFromQueryOptions = {
  /** Query parameter name to read delay from (default: "delay"). */
  queryParam?: string;
  /** Maximum delay allowed in milliseconds (default: 30_000). */
  maxMs?: number;
};

const sleep = async (ms: number): Promise<void> => {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
};

const coercePositiveInt = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const intValue = Math.trunc(value);
    return intValue > 0 ? intValue : null;
  }

  if (typeof value === 'string') {
    const intValue = Number.parseInt(value, 10);
    return Number.isFinite(intValue) && intValue > 0 ? intValue : null;
  }

  return null;
};

/**
 * Adds an artificial delay using a query parameter, e.g. `?delay=2000`.
 *
 * - Async/non-blocking (uses `await` on a timer)
 * - Can be mounted globally (`app.use`) or per-route (`router.get(..., delayFromQuery(), handler)`)
 */
export const delayFromQuery = (options: ApiDelayFromQueryOptions = {}): RequestHandler => {
  const queryParam = options.queryParam ?? 'delay';
  const maxMs = options.maxMs ?? 30_000;

  return async (req, _res, next) => {
    try {
      const rawQuery = (req.query as Record<string, unknown>)[queryParam];
      const rawValue = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;
      const requestedMs = coercePositiveInt(rawValue);

      if (requestedMs === null) {
        next();
        return;
      }

      const delayMs = Math.min(requestedMs, maxMs);
      if (delayMs > 0) {
        await sleep(delayMs);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

/**
 * Adds a fixed artificial delay, e.g. `fixedDelay(500)`.
 *
 * This is useful when you want a known delay for a specific endpoint.
 */
export const fixedDelay = (delayMs: number): RequestHandler => {
  const safeDelayMs = Math.max(0, Math.trunc(delayMs));

  return async (_req, _res, next) => {
    try {
      if (safeDelayMs > 0) {
        await sleep(safeDelayMs);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
