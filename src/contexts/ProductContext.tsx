import { getProducts } from 'api/productsApi';
import React, { createContext, useReducer, useContext, useEffect } from 'react';

// Define product structure
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// Define the initial state for products
interface ProductState {
  products: Record<string, Product>;
  loading: boolean;
  error: string | null;
}

// Actions
type ProductAction =
  | { type: 'SET_PRODUCTS'; payload: Record<string, Product> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

// Reducer to manage product state
const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: { ...state.products, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

interface ProductContextType extends ProductState {
  fetchProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(productReducer, {
    products: {},
    loading: false,
    error: null,
  });

  const fetchProducts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await getProducts();
      if('data' in response) {
      
      const formattedProducts = response.data.reduce((acc, product) => {
        acc[product.id] = {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock
        };
        return acc;
      }, {} as Record<string, Product>);
        dispatch({ type: 'SET_PRODUCTS', payload: formattedProducts });
      }
      // TODO: throw error
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch products' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ ...state, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProductContext must be used within a ProductProvider');
  return context;
};
