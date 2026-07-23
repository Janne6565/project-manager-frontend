export type UserRole = "USER" | "ADMIN" | "OWNER";

export interface User {
  username: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}

// Login-route search param signalling an OAuth (Authentik) failure:
// "noAccess" → user is in no access group; true → generic failure.
export type OAuthError = "noAccess" | boolean;
