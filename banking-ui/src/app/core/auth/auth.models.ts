export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN'
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  role: UserRole | string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface OtpRequest {
  username: string;
  otp: string;
}

export interface AuthResponse {
  message: string;
  token?: string | null;
}

export interface JwtPayload {
  sub: string;
  role: UserRole | string;
  exp?: number;
  iat?: number;
}

export function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

