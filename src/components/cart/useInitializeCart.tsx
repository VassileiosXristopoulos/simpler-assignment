import { createCart, getCart } from 'api/cartApi';
import { useEffect, useState } from 'react'
const CART_ID_KEY = 'cartId';

export default function useInitializeCart() {
  const [cart, setCart] = useState<any>(null)
  const initializeCart = async () => {
    console.log("initialize called")
    try {
      let cartId = localStorage.getItem(CART_ID_KEY);

      // TODO: cleanups and error checks
      if (!cartId || (+cartId !== +cartId)) {
        const response = await createCart();
        if ('headers' in response) {
          const locationHeader = response.headers?.get("Location");
          const cartId = locationHeader?.split("/carts/")[1];
          if(cartId) {
            localStorage.setItem(CART_ID_KEY, cartId);
          }
        }
      }

      if (cartId) {
        const response = await getCart(cartId);
        console.log(response)
        if ('headers' in response) {

          setCart(response.data);
        }
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to initialize cart');
    }
  }

  useEffect(() => {
    initializeCart();
  }, [])

  return {
    cart
  }
}
