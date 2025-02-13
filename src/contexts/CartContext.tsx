import { createCart, getCart, updateCart } from 'api/cartApi';
import { createContext, useReducer, ReactNode, useEffect, useContext } from 'react';
import { CartItem, Discount } from 'types';
import { isValidUUID } from 'utilities/utils';
const CART_ID_KEY = "cart_id_key";

//**
// Cart Context is responsible for maintaining the global state for cart, and also for retrieving the cart from the local storage/creating the cart entry if doesn't exist
//  */
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
  resetCart: () => void;
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

  const initializeCart = async () => {
    try {
      let cartId = localStorage.getItem(CART_ID_KEY);
      // TODO: cleanups and error checks
      if (!isValidUUID(cartId)) {
        const response = await createCart();
        if ('headers' in response) {
          const locationHeader = response.headers?.get("Location");
          cartId = locationHeader?.split("/carts/")[1] || null;
          if(cartId) {
            localStorage.setItem(CART_ID_KEY, cartId);
          }
        }
      }

      if (cartId) {
        const response = await getCart(cartId);
        if ('headers' in response) {
          dispatch({ type: "SET_CART", payload: response.data });
        }
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to initialize cart');
    }
  }
  
  useEffect(() => {
    initializeCart();
  }, [])
  
  const value = {
    ...state,
    setCartIsOpen: (cartIsOpen: boolean) => dispatch({ type: 'SET_IS_OPEN', payload: cartIsOpen }),
    updateCart: (cart: Cart) => dispatch({type: 'UPDATE_CART', payload: cart}),
    setCart: (cart: Cart) => dispatch({type: 'SET_CART', payload: cart}),
    clearCart: () => dispatch({type: 'CLEAR_CART'}),
    resetCart: () => {
      localStorage.removeItem(CART_ID_KEY)
      initializeCart();
    }
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within a CartProvider");
  return context;
};


