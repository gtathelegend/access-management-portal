import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

import type {
  AdminUser,
  CreateUserRequest,
  ListUsersParams,
  UpdateUserRequest,
  UsersListResponse,
} from '../models/user-admin.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  listUsers(params: ListUsersParams = {}) {
    let httpParams = new HttpParams();

    if (typeof params.page === 'number') httpParams = httpParams.set('page', String(params.page));
    if (typeof params.limit === 'number') httpParams = httpParams.set('limit', String(params.limit));
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    if (params.role) httpParams = httpParams.set('role', params.role);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.q) httpParams = httpParams.set('q', params.q);
    const delayMs = params.delay ?? params.delayMs;
    if (typeof delayMs === 'number' && delayMs > 0) httpParams = httpParams.set('delay', String(delayMs));

    return this.http.get<UsersListResponse>(`${environment.apiUrl}/users`, { params: httpParams });
  }

  createUser(payload: CreateUserRequest) {
    return this.http.post<AdminUser>(`${environment.apiUrl}/users`, payload);
  }

  updateUser(id: string, payload: UpdateUserRequest) {
    return this.http.put<AdminUser>(`${environment.apiUrl}/users/${encodeURIComponent(id)}`, payload);
  }

  deleteUser(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/users/${encodeURIComponent(id)}`);
  }
}
