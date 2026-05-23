import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize, retry, timer } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  // Skip loading for specific requests if needed via headers
  const skipLoading = req.headers.has('X-Skip-Loading');
  
  if (!skipLoading) {
    loadingService.show();
  }

  return next(req).pipe(
    // Retry logic: retry 2 times with a delay of 1s
    retry({
      count: 2,
      delay: (error, retryCount) => timer(retryCount * 1000)
    }),
    finalize(() => {
      if (!skipLoading) {
        loadingService.hide();
      }
    })
  );
};
