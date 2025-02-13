import { getDiscounts, updateCart } from 'api/cartApi';
import { useCartContext } from 'contexts/CartContext';
import { useProductContext } from 'contexts/ProductContext';
import { useFetch } from 'hooks/useFetch';
import { useMemo, useState } from 'react';
import { CartItem, Discount, Product } from 'types';

export function useCart() {
  const [error, setError] = useState<string | null>(null);
  const {cart, setCart} = useCartContext();
  const { products } = useProductContext();
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const { data: discounts } = useFetch<Discount[]>(getDiscounts, []);

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
  

  // TODO: check discount calculations
  const discountValue = useMemo(() => {
    if(!selectedDiscount) return 0;
    
    switch (selectedDiscount.type) {
      case "FLAT":
        return selectedDiscount.amount;
  
      case "PERCENTAGE":
        return (selectedDiscount.amount / 100) * total;
  
      case "BOGO":
        // Buy One Get One Free: Assume every second item is free
        if (totalItems === 0) return 0;
        const freeItems = Math.floor(totalItems / 2);
        const discountPerItem = total / totalItems;
        return freeItems * discountPerItem;
  
      default:
        return 0;
    }
  }, [selectedDiscount, total, totalItems])

  return {
    cart,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    checkout,
    total,
    subtotal,
    totalItems,
    discounts,
    selectedDiscount,
    setSelectedDiscount,
    discountValue
  };
}
