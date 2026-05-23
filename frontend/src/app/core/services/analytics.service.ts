import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AnalyticsStats {
  totalUsers: number;
  activeUsers: number;
  totalRecords: number;
  roleDistribution: { name: string; value: number }[];
  statusBreakdown: { name: string; value: number }[];
  verificationTrends: { name: string; value: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getDashboardStats() {
    return this.http.get<{ data: AnalyticsStats }>(`${this.apiUrl}/dashboard-stats`).pipe(
      map(response => response.data)
    );
  }
}
