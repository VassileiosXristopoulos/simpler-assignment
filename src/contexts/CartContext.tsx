import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  selectedDiscount?: string;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_DISCOUNT'; payload: string | undefined }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_IS_OPEN'; payload: boolean };

interface CartContextType extends CartState {
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setDiscount: (code: string | undefined) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.payload.id
              ? { ...item, quantity: Math.min(item.quantity + 1, action.payload.stock) }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { productId: action.payload.id, quantity: 1, product: action.payload }],
      };
    }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
      };
    case 'SET_DISCOUNT':
      return {
        ...state,
        selectedDiscount: action.payload,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        selectedDiscount: undefined,
      };
    case 'SET_IS_OPEN':
      return {
        ...state,
        isOpen: action.payload,
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    selectedDiscount: undefined,
    isOpen: false,
  });

  const value = {
    ...state,
    addItem: (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product }),
    updateQuantity: (productId: string, quantity: number) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
    removeItem: (productId: string) => dispatch({ type: 'REMOVE_ITEM', payload: productId }),
    setDiscount: (code: string | undefined) => dispatch({ type: 'SET_DISCOUNT', payload: code }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    setIsOpen: (isOpen: boolean) => dispatch({ type: 'SET_IS_OPEN', payload: isOpen }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}


