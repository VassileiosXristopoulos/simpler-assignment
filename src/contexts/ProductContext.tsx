import React, { createContext, useReducer, useContext, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductState {
  products: Record<string, Product>;
}

type ProductAction = { type: 'SET_PRODUCTS'; payload: Record<string, Product> }

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: { ...state.products, ...action.payload } };
    default:
      return state;
  }
}

interface ProductContextType extends ProductState {
  setProducts: (products: Record<string, Product>) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(productReducer, {
    products: {},
  });

  const value = {
    ...state,
    setProducts: (products: Record<string, Product>) => dispatch({ type: "SET_PRODUCTS", payload: products })
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProductContext must be used within a ProductProvider');
  return context;
};
