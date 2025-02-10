import { useContext, useMemo } from 'react';
import { CartContext } from 'contexts/CartContext';

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const {
    items: cartItems,
    selectedDiscount,
    isOpen,
    setIsOpen,
    updateQuantity: updateCartQuantity,
    removeItem: removeFromCart,
    setDiscount: applyDiscount,
    clearCart,
    addItem
  } = context;

  const { totalItems, subtotal } = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.subtotal += item.product.price * item.quantity;
        return acc;
      },
      { totalItems: 0, subtotal: 0 }
    );
  }, [cartItems]);

  const discount = useMemo(() => {
    return selectedDiscount ? (cartItems.length > 0 ? 10 : 0) : 0;
  }, [cartItems.length, selectedDiscount]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  return {
    cartItems,
    totalItems,
    selectedDiscount,
    isOpen,
    setIsOpen,
    subtotal,
    discount,
    total,
    updateCartQuantity,
    removeFromCart,
    applyDiscount,
    clearCart,
    addToCart: addItem
  };
}
