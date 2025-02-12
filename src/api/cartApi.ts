import { APIResponse, CreateCartResponse } from "types/api";
import { get, post, put } from "./apiCallerHelper.core";
import { Cart, CartItem, Discount } from "types";

export async function createCart(): Promise<APIResponse<CreateCartResponse>> {
  return post('/carts');
}

export async function getCart(cartId: string): Promise<APIResponse<Cart>> {
  return await get(`/carts/${cartId}`);
}

export async function updateCart(cartId: string, cartItems: CartItem[]): Promise<APIResponse<Cart>> {
  return put(`/carts/${cartId}`, {
    body: JSON.stringify(cartItems),
    contentType: 'application/json'
  });
}

export async function getDiscounts(): Promise<APIResponse<Discount[]>> {
  return get(`/discounts`);
}
