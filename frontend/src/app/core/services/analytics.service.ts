import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import type { DashboardStatsResponse } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  getDashboardStats(delayMs = environment.demoDelayMs) {
    let params = new HttpParams();

    if (delayMs > 0) {
      params = params.set('delay', String(delayMs));
    }

    return this.http.get<{ data: DashboardStatsResponse }>(this.apiUrl, { params }).pipe(
      map(response => response.data)
    );
  }
}
