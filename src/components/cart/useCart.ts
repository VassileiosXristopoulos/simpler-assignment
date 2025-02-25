import { createCart, getCart, updateCart } from 'api/cartApi';
import { addOrder } from 'api/orderApi';
import { useCartContext } from 'contexts/CartContext';
import { useProductContext } from 'contexts/ProductContext';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Product } from 'types';
import { CART_ID_KEY } from 'utilities/constants';
import { isValidUUID } from 'utilities/utils';

export function useCart() {
  const { cart, setCart, setCartIsOpen, clearCart, setCartError, selectedDiscount } = useCartContext();
  const { products } = useProductContext();
  const navigate = useNavigate();
  const { totalItems, subtotal } = useMemo(() => calculateCartTotals(cart?.items ?? [], products), [cart?.items, products]);

  const initializeCart = useCallback(async () => {
    try {
      let cartId = localStorage.getItem(CART_ID_KEY);
      if (!isValidUUID(cartId)) {
        cartId = await createCart();
        if (cartId) {
          localStorage.setItem(CART_ID_KEY, cartId);
        }
      }
      
      if (cartId) {
        const retrievedCart = await getCart(cartId);
        if (retrievedCart) {
          setCart(retrievedCart);
        }
      }
    } catch (err) {
      if (String(err).includes("404")) {
        localStorage.removeItem(CART_ID_KEY);
      }
      setCartError(String(err));
      throw new Error(err instanceof Error ? err.message : 'Failed to initialize cart');
    }
  }, [setCart, setCartError]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!cart?.id) return;
    try {
      let updatedCartItems = [];
      if (cart.items.find((cartItem) => cartItem.productId === product.id)) {
        updatedCartItems = cart.items.map((cartItem: CartItem) => {
          if (cartItem.productId !== product.id) return cartItem;
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

      const updatedCart = await updateCart(cart.id, updatedCartItems);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      setCartError(err instanceof Error ? err.message : 'Failed to add item to cart');
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!cart?.id) return;

    try {
      const updatedCartItems = cart.items.map((cartItem: CartItem) => {
        if (cartItem.productId !== productId) return cartItem;
        return {
          ...cartItem,
          quantity: quantity
        }
      })
      const updatedCart = await updateCart(cart.id, updatedCartItems);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      setCartError(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  }

  const removeItem = async (productId: string) => {
    if (!cart?.id) return;
    try {
      const updatedCartItems = cart.items.filter((cartItem: CartItem) => cartItem.productId !== productId);
      const updatedCart = await updateCart(cart.id, updatedCartItems);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      setCartError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  }

  const onCheckout = async () => {
    try {
      await addOrder(cart?.id || null, selectedDiscount?.code || "")
      clearCart();
      localStorage.removeItem(CART_ID_KEY)
      setCartIsOpen(false)
      navigate('/order-success')
    } catch (error) {
      console.log(error)
    }
  }
  
  function calculateCartTotals(cartItems: CartItem[], products: Record<string, Product>) {
    return cartItems.reduce(
      (acc, item) => {
        const product = products[item.productId];
        if (!product) return acc;
        acc.totalItems += item.quantity;
        acc.subtotal += product.price * item.quantity;
        return acc;
      },
      { totalItems: 0, subtotal: 0 }
    );
  }

  return {
    addToCart,
    updateQuantity,
    removeItem,
    onCheckout,
    subtotal,
    totalItems,
    initializeCart,
  };
}
