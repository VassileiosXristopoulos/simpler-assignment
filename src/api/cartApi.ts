import { APIResponse, CreateCartResponse } from "types/api";
import { get, post, put } from "./apiCallerHelper.core";
import { Cart, CartAPI, CartItem, Discount } from "types";

// TODO refactor to return directly cart id
export async function createCart(): Promise<APIResponse<CreateCartResponse>> {
  return post('/carts');
}

// TODO: refactor to return directly cart object
export async function getCart(cartId: string): Promise<APIResponse<Cart>> {
  const response = await get(`/carts/${cartId}`);
  
  // TODO: export to function and do error checks
  if ('data' in response && response.data) {
    const responseData = JSON.parse(response.data as string) as CartAPI;
    const transformedCart: Cart = {
      ...responseData,
      id: responseData.id,
      items: responseData.items.map((item) => ({
        productId: item.product_id, // Convert product_id -> productId
        quantity: item.quantity
      }))
    };

    return { ...response, data: transformedCart };
  }

  return response as APIResponse<Cart>; // If no data, return original response
}

export async function updateCart(cartId: string, cartItems: CartItem[]): Promise<APIResponse<Cart>> {
  // Convert request payload
  const itemsPayload = cartItems.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity
  }));

  // Perform API request
  const response = await put(`/carts/${cartId}`, {
    body: JSON.stringify(itemsPayload),
    contentType: 'application/json'
  });

  // Ensure data exists before transforming
  if ('data' in response && response.data) {
    const responseData = response.data as CartAPI;
    const transformedCart: Cart = {
      ...responseData,
      id: responseData.id,
      items: responseData.items.map((item) => ({
        productId: item.product_id, // Convert product_id -> productId
        quantity: item.quantity
      }))
    };

    return { ...response, data: transformedCart };
  }

  return response as APIResponse<Cart>; // If no data, return original response
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
