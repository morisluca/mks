/**
 * API Configuration
 * Handles base URL setup for different environments
 */

import { getToken } from "./auth";

export function getApiUrl(): string {
  // For production, use environment variable or current origin
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (apiUrl) {
    return apiUrl;
  }

  // In production without explicit config, use current origin
  if (import.meta.env.PROD) {
    return window.location.origin;
  }

  // In development, use localhost backend
  return "http://localhost:3001";
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { responseType?: "json" | "text" } = {}
): Promise<T> {
  const { responseType = "json", ...init } = options;
  const url = `${getApiUrl()}${endpoint}`;
  const token = getToken();

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.statusText}`);
  }

  if (responseType === "text") {
    return (await response.text()) as T;
  }

  return response.json() as Promise<T>;
}

