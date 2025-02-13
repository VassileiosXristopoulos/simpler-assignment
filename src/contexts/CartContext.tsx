import { createContext, useReducer, ReactNode, useEffect, useContext } from 'react';
import { CartItem } from 'types';

interface CartState {
  cartIsOpen: boolean;
  cart: Cart | null;
}

interface Cart {
  id: string;
  items: CartItem[];
}

type CartAction = 
  | { type: 'SET_IS_OPEN'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'UPDATE_CART'; payload: Cart }
  | { type: 'CLEAR_CART' }

interface CartContextType extends CartState {
  setCartIsOpen: (cartIsOpen: boolean) => void;
  updateCart: (cart: Cart) => void;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
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
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cartIsOpen: false,
    cart: null,
  });

  const value = {
    ...state,
    setCartIsOpen: (cartIsOpen: boolean) => dispatch({ type: 'SET_IS_OPEN', payload: cartIsOpen }),
    updateCart: (cart: Cart) => dispatch({type: 'UPDATE_CART', payload: cart}),
    setCart: (cart: Cart) => dispatch({type: 'SET_CART', payload: cart}),
    clearCart: () => dispatch({type: 'CLEAR_CART'}),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within a CartProvider");
  return context;
};


