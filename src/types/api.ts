export type RequestOptions = {
  headers?: HeadersInit;
  params?: Record<string, string>;
  body?: BodyInit;
  cache?: RequestCache;
  signal?: AbortSignal;
  contentType?: string;
};

export type APIErrorResponse = {
  error: string;
}

export type APISuccessResponse<T> = {
  data: T;
  message?: string;
  headers?: Headers;
}

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

export interface CreateCartResponse {
  cartId: string;
}
