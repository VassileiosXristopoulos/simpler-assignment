import { RequestOptions } from "types/api";

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


export async function handleResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();
    throw new APIError(response.status, response.statusText, data.error);
  }

  return response;
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

export async function get(endpoint: string, options: RequestOptions = {}): Promise<Response> {
  const { params, signal } = options;
  const url = buildUrl(endpoint, params);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(options),
    signal,
  });

  return handleResponse(response);
}

export async function post(endpoint: string, options: RequestOptions = {}): Promise<Response> {
  const { body, signal } = options;
  const url = buildUrl(endpoint);

  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(options),
    body,
    signal,
  });

  return handleResponse(response);
}
