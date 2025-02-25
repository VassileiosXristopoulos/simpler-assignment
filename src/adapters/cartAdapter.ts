import { CartAPI, CartItem } from "types";

export const adaptCartItemsToApi = (cartItems: Record<string, CartItem>) => {
  return Object.values(cartItems).map((item: CartItem) => ({
    product_id: item.productId,
    quantity: item.quantity
  }));
};
export const adaptCartFromApi = (cartAPIData: CartAPI) => {
  return {
    ...cartAPIData,
    id: cartAPIData.id,
    items: cartAPIData.items.reduce((acc, item) => {
      acc[item.product_id] = {
        productId: item.product_id, // Convert product_id -> productId
        quantity: item.quantity
      }
      return acc;
    }, {} as Record<string, CartItem>)
  };
};
