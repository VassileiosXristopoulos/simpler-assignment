import { APIResponse } from "types/api";
import { get, post, put } from "./apiCallerHelper.core";
import { CartAPI, CartItem, Discount } from "types";
import { adaptCartFromApi, adaptCartItemsToApi } from "adapters/cartAdapter";

export async function createCart() {
  const response = post('/carts');
  if ('headers' in response) {
    const responseHeaderss = response.headers as Headers;
    const locationHeader = responseHeaderss?.get("Location");
    return locationHeader?.split("/carts/")[1] || null;
  }
  return null;
}

export async function getCart(cartId: string) {
  const response = await get(`/carts/${cartId}`);
  if ('data' in response && response.data) {
    const responseData = JSON.parse(response.data as string) as CartAPI;
    return adaptCartFromApi(responseData);
  }

  return null;
}

export async function updateCart(cartId: string, cartItems: CartItem[]) {
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

export async function getDiscounts(): Promise<APIResponse<Discount[]>> {
  return get(`/discounts`);
}

// TODO: should not be here
export async function addOrder(cartId: string | null, discountCode: string): Promise<APIResponse<unknown>> {
  if (!cartId) {
    return Promise.reject(new Error("cartId cannot be null"));
  }

  const addOrderPayload = {
    cart_id: cartId,
    discount_code: discountCode
  };

  return post('/orders', {
    body: JSON.stringify(addOrderPayload),
    contentType: 'application/json'
  });
}
