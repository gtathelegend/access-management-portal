export type UserRole = 'admin' | 'user';

export interface LoginRoleOption {
  value: UserRole;
  label: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
