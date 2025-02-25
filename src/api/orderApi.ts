import { APIResponse } from "types/api";
import { post } from "./apiCallerHelper.core";

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
