import { useContext } from 'react';
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

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discount = selectedDiscount ? (cartItems.length > 0 ? 10 : 0) : 0;
  const total = Math.max(0, subtotal - discount);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
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
