import { addOrder, createCart, getCart, getDiscounts, updateCart } from 'api/cartApi';
import { useCartContext } from 'contexts/CartContext';
import { useProductContext } from 'contexts/ProductContext';
import { useFetch } from 'hooks/useFetch';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Discount, Product } from 'types';
import { CART_ID_KEY } from 'utilities/constants';
import { isValidUUID } from 'utilities/utils';

export function useCart() {
  const {cart, setCart, setCartIsOpen, clearCart, setCartError, cartError} = useCartContext();
  const { products } = useProductContext();
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const { data: discounts } = useFetch<Discount[]>(getDiscounts, []);
  const navigate  = useNavigate();

  const initializeCart = async () => {
    try {
      let cartId = localStorage.getItem(CART_ID_KEY);
      // TODO: cleanups and error checks
      console.log("before initializing cart: " + cartId)
      if (!isValidUUID(cartId)) {
        console.log("Cart id not found")
        const response = await createCart();
        if ('headers' in response) {
          const locationHeader = response.headers?.get("Location");
          cartId = locationHeader?.split("/carts/")[1] || null;
          if(cartId) {
            console.log("setting new cart id: " + cartId)
            localStorage.setItem(CART_ID_KEY, cartId);
          }
        }
      }
      // TODO: if i have new cart i should now request again
      if (cartId) {
        const response = await getCart(cartId);
        const dataInResponse = 'data' in response;
        console.log("data in response: " + dataInResponse)
        if ('data' in response) {
          // dispatch({ type: "SET_CART", payload: response.data });
          setCart(response.data);
        }
      }
    } catch (err) {
      setCartError(String(err));
      throw new Error(err instanceof Error ? err.message : 'Failed to initialize cart');
    }
  }
  
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
      setCartError(err instanceof Error ? err.message : 'Failed to add item to cart');
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
      setCartError(err instanceof Error ? err.message : 'Failed to update quantity');
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
      setCartError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  }


  const onCheckout = async () => {
    try {
      // TODO: check valid response
      await addOrder(cart?.id || null, selectedDiscount?.code || "")
      clearCart();
      localStorage.removeItem(CART_ID_KEY)
      setCartIsOpen(false)
      navigate('/order-success')
    } catch(error) {
      console.log(error)
    }
    
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
    addToCart,
    updateQuantity,
    removeItem,
    onCheckout,
    total,
    subtotal,
    totalItems,
    discounts,
    selectedDiscount,
    setSelectedDiscount,
    discountValue,
    initializeCart,
    cartError
  };
}
