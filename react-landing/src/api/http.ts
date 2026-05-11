/// <reference types="vite/client" />
/**
 * Base API Client using fetch
 */

const BASE_URL = import.meta.env.VITE_API_BASEURL;

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // For 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();

  // We return data for success AND handled error codes (400, 409)
  // The caller will check the success field or status code
  if (response.ok || [400, 409].includes(response.status)) {
    return data as T;
  }

  throw new Error(data.message || `Request failed with status ${response.status}`);
}
