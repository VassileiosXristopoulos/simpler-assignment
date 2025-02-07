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

export type APISuccessResponse = {
  message: string;
}

export type APIResponse = APIErrorResponse | APISuccessResponse;
