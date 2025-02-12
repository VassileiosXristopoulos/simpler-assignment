import { APIResponse, RequestOptions } from "types/api";

const BASE_URL = import.meta.env.VITE_BACKEND_DOMAIN || 'http://localhost:8080';

function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(endpoint, BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
}

function buildHeaders(options: RequestOptions): HeadersInit {
  const { headers = {}, contentType } = options;
  
  return {
    ...(contentType && { 'Content-Type': contentType }),
    ...headers,
  };
}

export async function handleResponse<T>(response: Response): Promise<APIResponse<T>> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  
  if (!response.ok) {
    const errorData = isJson ? await response.json() : { error: await response.text() };
    throw new APIError(response.status, response.statusText, errorData);
  }

  if (isJson) {
    const data = await response.json();
    return {
      data: data as T,
      headers: response.headers,
      message: 'Success'
    };
  }
  
  const text = await response.text();
  return {
    data: text as unknown as T,
    message: 'Success',
    headers: response.headers,
  };
}

export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'APIError';
  }
}

export async function get<T>(endpoint: string, options: RequestOptions = {}): Promise<APIResponse<T>> {
  const { params, signal } = options;
  const url = buildUrl(endpoint, params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(options),
    signal,
  });

  return handleResponse<T>(response);
}

export async function post<T>(endpoint: string, options: RequestOptions = {}): Promise<APIResponse<T>> {  const { body, signal } = options;
  const url = buildUrl(endpoint);

  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(options),
    body,
    signal,
  });

  return handleResponse<T>(response);
}

export async function put<T>(endpoint: string, options: RequestOptions = {}): Promise<APIResponse<T>> {
  const { body, signal } = options;
  const url = buildUrl(endpoint);

  const response = await fetch(url, {
    method: 'PUT',
    headers: buildHeaders(options),
    body,
    signal,
  });

  return handleResponse<T>(response);
}
