// In-memory access token for the house session model.
//
// The short-lived access token is deliberately kept in memory only (never
// localStorage/sessionStorage/cookies) so it is not reachable by XSS or left
// behind after a tab closes. The long-lived httpOnly refresh cookie is what
// survives reloads and silently re-mints this token on bootstrap / 401.

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}
