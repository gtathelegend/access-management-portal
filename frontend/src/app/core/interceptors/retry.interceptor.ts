import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timer } from 'rxjs';

const retryableMethods = new Set(['GET', 'HEAD', 'OPTIONS']);

const isRetryableError = (error: unknown): boolean => {
  return error instanceof HttpErrorResponse && (error.status === 0 || error.status >= 500);
};

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const skipRetry = req.headers.has('X-Skip-Retry');

  if (skipRetry || !retryableMethods.has(req.method.toUpperCase())) {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: 2,
      delay: (error, retryCount) => {
        if (!isRetryableError(error)) {
          return throwError(() => error);
        }

        return timer(Math.min(400 * retryCount, 1200));
      },
    }),
  );
};