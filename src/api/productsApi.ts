import { get } from "./apiCallerHelper.core";
import { Product } from "types";
import { adaptProductsFromApi } from "adapters/productAdapters";

export async function getProducts() {
  const response = await get<Product[]>('/products');
  if('data' in response) {
    return adaptProductsFromApi(response.data);
  }
  
  return null;
}
