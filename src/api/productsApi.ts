import { get } from "./apiCallerHelper.core";

export async function getProducts(): Promise<Response> {
  return get('/products');
}
