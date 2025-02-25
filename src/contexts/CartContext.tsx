import { createContext, useReducer, ReactNode, useEffect, useContext } from 'react';
import { CartItem, Discount } from 'types';

interface CartState {
  cartIsOpen: boolean;
  cartError: string;
  cart: Cart | null;
  selectedDiscount: Discount | null;
}

interface Cart {
  id: string;
  items: Record<string, CartItem>;
}

type CartAction = 
  | { type: 'SET_IS_OPEN'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'UPDATE_CART'; payload: Cart }
  | { type: 'SET_CART_ERROR'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_DISCOUNT'; payload: Discount }
  | { type: 'CLEAR_DISCOUNT'; }

export interface CartContextType extends CartState {
  setCartIsOpen: (cartIsOpen: boolean) => void;
  updateCart: (cart: Cart) => void;
  setCart: (cart: Cart) => void;
  setCartError: (error: string) => void;
  clearCart: () => void;
  setSelectedDiscount: (discount: Discount) => void;
  clearDiscount: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_IS_OPEN':
      return {
        ...state,
        cartIsOpen: action.payload,
      };
      case "SET_CART":
      case "UPDATE_CART":
        return { ...state, cart: action.payload };
      case "CLEAR_CART":
        return { ...state, cart: null };
      case "SET_CART_ERROR":
        return { ...state, cartError: action.payload };
      case "SET_DISCOUNT":
        return { ...state, selectedDiscount: action.payload };
      case "CLEAR_DISCOUNT":
        return { ...state, selectedDiscount: null };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cartIsOpen: false,
    cartError: "",
    cart: null,
    selectedDiscount: null
  });

  const value = {
    ...state,
    setCartIsOpen: (cartIsOpen: boolean) => dispatch({ type: 'SET_IS_OPEN', payload: cartIsOpen }),
    updateCart: (cart: Cart) => dispatch({type: 'UPDATE_CART', payload: cart}),
    setCart: (cart: Cart) => dispatch({type: 'SET_CART', payload: cart}),
    setCartError: (error: string) => dispatch({type: 'SET_CART_ERROR', payload: error}),
    clearCart: () => dispatch({type: 'CLEAR_CART'}),
    setSelectedDiscount: (discount: Discount) => dispatch({type: 'SET_DISCOUNT', payload: discount}),
    clearDiscount: () => dispatch({type: 'CLEAR_DISCOUNT'}),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within a CartProvider");
  return context;
};


