import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import type { ListRecordsParams, RecordsListResponse, VerificationRecord } from '../models/record.model';

@Injectable({ providedIn: 'root' })
export class RecordsService {
  private readonly http = inject(HttpClient);

  listRecords(params: ListRecordsParams = {}) {
    let httpParams = new HttpParams();

    if (typeof params.page === 'number') httpParams = httpParams.set('page', String(params.page));
    if (typeof params.limit === 'number') httpParams = httpParams.set('limit', String(params.limit));
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.verificationType) httpParams = httpParams.set('verificationType', params.verificationType);
    if (params.accessLevel) httpParams = httpParams.set('accessLevel', params.accessLevel);
    if (params.userId) httpParams = httpParams.set('userId', params.userId);
    if (params.approvedBy) httpParams = httpParams.set('approvedBy', params.approvedBy);
    if (params.createdFrom) httpParams = httpParams.set('createdFrom', params.createdFrom);
    if (params.createdTo) httpParams = httpParams.set('createdTo', params.createdTo);

    return this.http.get<RecordsListResponse>('/api/v1/records', { params: httpParams });
  }

  getRecord(id: string) {
    return this.http.get<VerificationRecord>(`/api/v1/records/${encodeURIComponent(id)}`);
  }
}
