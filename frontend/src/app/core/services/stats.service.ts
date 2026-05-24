import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import type { DashboardStatsResponse } from '../models/stats.model';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly http = inject(HttpClient);

  getDashboardStats(delayMs = environment.demoDelayMs) {
    let params = new HttpParams();

    if (delayMs > 0) {
      params = params.set('delay', String(delayMs));
    }

    return this.http.get<{ data: DashboardStatsResponse }>(`${environment.apiUrl}/stats`, { params }).pipe(
      map((response) => response.data),
    );
  }
}