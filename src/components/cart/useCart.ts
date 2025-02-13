import { createCart, getCart, updateCart } from 'api/cartApi';
import { CartContext, useCartContext } from 'contexts/CartContext';
import { useProductContext } from 'contexts/ProductContext';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Cart, CartItem, Product } from 'types';

export function useCart() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {setCartIsOpen, cartIsOpen, cart, setCart} = useCartContext();
  const { products } = useProductContext();

  const addToCart = async (product: Product, quantity = 1) => {
    if (!cart?.id) return;
    try {
      let updatedCartItems = [];
      if(cart.items.find((cartItem) => cartItem.productId === product.id)) {
        updatedCartItems = cart.items.map((cartItem: CartItem) => {
          if(cartItem.productId !== product.id) return cartItem;
          return {
            ...cartItem,
            quantity: cartItem.quantity + 1
          }
        })
      } else {
        updatedCartItems = [
          ...cart.items,
          {
            productId: product.id,
            quantity: quantity,
          }
        ]
      }
      
      const response = await updateCart(cart.id, updatedCartItems);
      
      if ('data' in response) {
        // TODO: normalize data conversions
        setCart(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
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
  }

  const removeItem = async (productId: string) => {
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
  }


  const checkout = async () => {
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
  }
  const { totalItems, subtotal } = useMemo(() => {
    return (cart?.items ?? []).reduce(
      (acc, item) => {
        const product = products[item.productId];
        if(!product) return acc;
        const price = product.price;
        acc.totalItems += item.quantity;
        acc.subtotal += price * item.quantity;
        return acc;
      },
      { totalItems: 0, subtotal: 0 }
    );
  }, [cart?.items, products]);
  
  const discount = 0;
  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);
  

  return {
    cart,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    checkout,
    cartIsOpen,
    setCartIsOpen,
    total,
    subtotal,
    totalItems
  };
}
