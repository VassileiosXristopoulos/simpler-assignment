import { CartAPI, CartItem } from "types";

export const adaptCartItemsToApi = (cartItems: CartItem[]) => {
  return cartItems.map((item: CartItem) => ({
    product_id: item.productId,
    quantity: item.quantity
  }));
};

export const adaptCartFromApi = (cartAPIData: CartAPI) => {
  return {
    ...cartAPIData,
    id: cartAPIData.id,
    items: cartAPIData.items.map((item) => ({
      productId: item.product_id, // Convert product_id -> productId
      quantity: item.quantity
    }))
  };
};
