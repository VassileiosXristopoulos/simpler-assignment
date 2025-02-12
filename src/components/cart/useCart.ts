import { createCart, getCart, updateCart } from 'api/cartApi';
import { CartContext } from 'contexts/CartContext';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Cart, CartItem, Product } from 'types';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  const {
    setCartIsOpen,
    cartIsOpen
  } = context;
  

  // Get or create cart
  const initializeCart = useCallback(async () => {
    try {
      setIsLoading(true);
      let cartId = localStorage.getItem(CART_ID_KEY);

      if (!cartId || (+cartId !== +cartId)) {
        console.log("cart id invalid")
        const response = await createCart();
        if ('data' in response) {
          cartId = response.data.cartId;
          localStorage.setItem(CART_ID_KEY, cartId);
        }
      }

      if (cartId) {
        const response = await getCart(cartId);
        
        if ('data' in response) {
          setCart(response.data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  const addItem = useCallback(async (product: Product, quantity = 1) => {
    if (!cart?.id) return;

    try {
      let updatedCartItems = [];
      if(cart.items.find((cartItem) => cartItem.productId === product.id)) {
        updatedCartItems = cart.items.map((cartItem: CartItem) => {
          if(cartItem.productId !== product.id) return cartItem;
          return {
            ...cartItem,
            quantity: quantity
          }
        })
      } else {
        updatedCartItems = [
          ...cart.items,
          {
            productId: product.id,
            quantity: quantity,
            product: product
          }
        ]
      }
      const response = await updateCart(cart.id, updatedCartItems);
      if ('data' in response) {
        setCart(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    }
  }, [cart?.id]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (!cart?.id) return;

    try {
      const updatedCartItems = cart.items.map((cartItem: CartItem) => {
        if(cartItem.productId !== productId) return cartItem;
        return {
          ...cartItem,
          quantity: quantity
        }
      })
      const response = await updateCart(cart.id, updatedCartItems);
      if ('data' in response) {
        setCart(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  }, [cart?.id]);

  const removeItem = useCallback(async (productId: string) => {
    if (!cart?.id) return;
    try {
      const updatedCartItems = cart.items.filter((cartItem: CartItem) => cartItem.productId !== productId);
      const response = await updateCart(cart.id, updatedCartItems);
      if ('data' in response) {
        setCart(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  }, [cart?.id]);


  const checkout = useCallback(async () => {
    // if (!cart?.id) return;

    // try {
    //   await api.checkout(cart.id);
    //   localStorage.removeItem(CART_ID_KEY);
    //   setCart(null);
    //   return true;
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'Checkout failed');
    //   return false;
    // }
  }, [cart?.id]);
  
  const { totalItems, subtotal } = useMemo(() => {
    return (cart?.items ?? []).reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.subtotal += item.product.price * item.quantity;
        return acc;
      },
      { totalItems: 0, subtotal: 0 }
    );
  }, [cart?.items]);
  
  const discount = 0;
  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);
  

  return {
    cart,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    checkout,
    refreshCart: initializeCart,
    cartIsOpen,
    setCartIsOpen,
    total
  };
}
