export interface User {
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  username: string;
  expiresIn: number;
}

export interface AuthStatus {
  authenticated: boolean;
  username: string | null;
}
