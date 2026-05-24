import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

const parseDelayMs = (value: string | null): number => {
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 2500) : 0;
};

const describeRequest = (method: string, url: string): string => {
  const shortUrl = url.replace(/^https?:\/\/[^/]+/, '');
  return `${method.toUpperCase()} ${shortUrl}`;
};

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  const skipLoading = req.headers.has('X-Skip-Loading');
  const delayHeader = req.headers.get('X-Demo-Delay-Ms');
  const delayParam = req.params.get('delay') ?? req.params.get('delayMs');
  const delayMs = parseDelayMs(delayHeader ?? delayParam);
  const requestLabel = describeRequest(req.method, req.urlWithParams);
  const requestDetail = delayMs > 0
    ? `API delay enabled for ${delayMs}ms`
    : 'Fetching the latest data';
  
  if (!skipLoading) {
    loadingService.beginRequest(requestLabel, requestDetail);
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loadingService.endRequest();
      }
    }),
  );
};
