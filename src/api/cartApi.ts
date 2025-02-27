import { get, post, put } from "./apiCallerHelper.core";
import { CartAPI, CartItem } from "types";
import { adaptCartFromApi, adaptCartItemsToApi } from "adapters/cartAdapter";

export async function createCart() {
  const response = await post('/carts');
  if ('headers' in response) {
    const responseHeaderss = response.headers as Headers;
    const locationHeader = responseHeaderss?.get("Location");
    return locationHeader?.split("/carts/")[1] || null;
  }
  throw new Error("Error while creating cart");
}

export async function getCart(cartId: string) {
  const response = await get(`/carts/${cartId}`);
  if ('data' in response && response.data) {
    const responseData = JSON.parse(response.data as string) as CartAPI;
    return adaptCartFromApi(responseData);
  }

  throw new Error("Error while fetching cart");
}

export async function updateCart(cartId: string, cartItems: Record<string, CartItem>) {
  const itemsPayload = adaptCartItemsToApi(cartItems);
  const response = await put(`/carts/${cartId}`, {
    body: JSON.stringify(itemsPayload),
    contentType: 'application/json'
  });

  if ('data' in response && response.data) {
    const responseData = response.data as CartAPI;
    return adaptCartFromApi(responseData);
  }

  return null;
}
