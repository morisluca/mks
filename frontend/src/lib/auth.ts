import { setAuthTokenGetter, setBaseUrl } from "./api-client";
import { getApiUrl } from "./api-config";

const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Initialize the auth token getter for API calls
setAuthTokenGetter(() => getToken());

// Initialize the base URL for API calls
setBaseUrl(getApiUrl());
