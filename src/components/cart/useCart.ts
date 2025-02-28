import { createCart, getCart, updateCart } from 'api/cartApi';
import { addOrder } from 'api/orderApi';
import { useCartContext } from 'contexts/CartContext';
import { useProductContext } from 'contexts/ProductContext';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Product } from 'types';
import { CART_ID_KEY } from 'utilities/constants';
import { calculateCartTotals, isValidUUID } from 'utilities/utils';

export function useCart() {
  const { cart, setCart, setCartIsOpen, clearCart, setCartError, selectedDiscount } = useCartContext();
  const { products } = useProductContext();
  const navigate = useNavigate();
  const { totalItems, subtotal } = useMemo(() => calculateCartTotals(cart?.items ?? {}, products), [cart?.items, products]);

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
      setCartError("Error while initializing the Cart: " + String(err));
    }
  }, [setCart, setCartError]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!cart?.id) return;

    try {
      const updatedCartItems: Record<string, CartItem> = { ...cart.items };
      
      // If the item is already in the cart, add to it's quantity, otherwise initialize with the given quantity
      updatedCartItems[product.id] = updatedCartItems[product.id]
        ? { ...updatedCartItems[product.id], quantity: updatedCartItems[product.id].quantity + quantity }
        : { productId: product.id, quantity };

      const updatedCart = await updateCart(cart.id, updatedCartItems);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      setCartError("Error while adding to Cart: " + (err instanceof Error ? err.message : 'Failed to add item to cart'));
    }
  };


  const updateQuantity = async (productId: string, quantity: number) => {
    if (!cart?.id) return;

    try {
      const updatedCartItems: Record<string, CartItem> = cart.items || {};
      if (updatedCartItems[productId]) { // If the item exists, update the quantity
        updatedCartItems[productId].quantity = quantity;
      }
      const updatedCart = await updateCart(cart.id, updatedCartItems);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      setCartError("Error while updating Cart item quantity: " + (err instanceof Error ? err.message : 'Failed to update quantity'));
    }
  };

  const removeItem = async (productId: string) => {
    if (!cart?.id) return;

    try {
      const updatedCartItems: Record<string, CartItem> = { ...cart.items };

      // Remove the item by deleting the corresponding property
      delete updatedCartItems[productId];

      const updatedCart = await updateCart(cart.id, updatedCartItems);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (err) {
      setCartError("Error while removing from Cart: " + (err instanceof Error ? err.message : 'Failed to remove item'));
    }
  };

  const onCheckout = async () => {
    try {
      await addOrder(cart?.id || null, selectedDiscount?.code || "")
      clearCart();
      localStorage.removeItem(CART_ID_KEY)
      setCartIsOpen(false)
      navigate('/order-success')
    } catch (error) {
      throw new Error("error completing order: " + String(error));
    }
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
