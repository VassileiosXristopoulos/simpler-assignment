import { APIResponse } from "types/api";
import { get } from "./apiCallerHelper.core";
import { Product } from "types";

export async function getProducts(): Promise<APIResponse<Product[]>> {
  return get<Product[]>('/products');
}
