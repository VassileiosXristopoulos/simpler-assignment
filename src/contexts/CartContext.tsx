import { createContext, useReducer, ReactNode, useEffect } from 'react';

interface CartState {
  cartIsOpen: boolean;
  cart: any;
}

type CartAction = { type: 'SET_IS_OPEN'; payload: boolean };

interface CartContextType extends CartState {
  setCartIsOpen: (cartIsOpen: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_IS_OPEN':
      return {
        ...state,
        cartIsOpen: action.payload,
      };
    default:
      return state;
  }
}

export function CartProvider({ children, initialCart }: { children: ReactNode, initialCart: any }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cartIsOpen: false,
  });


  const value = {
    ...state,
    setCartIsOpen: (cartIsOpen: boolean) => dispatch({ type: 'SET_IS_OPEN', payload: cartIsOpen }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}


