import "@testing-library/jest-dom";
import { ProductProvider } from 'contexts/ProductContext';
import { CartContextType, CartContext } from "contexts/CartContext";
import { BrowserRouter } from 'react-router-dom';
import { render, renderHook } from '@testing-library/react';

/**
 * Shared wrapper for both components and hooks
 */
const AllProviders = ({ children, cartProviderInitialValue }: { children: React.ReactNode, cartProviderInitialValue?: CartContextType }) => (
  <ProductProvider>
    <CartContext.Provider value={cartProviderInitialValue}>
      <BrowserRouter>{children}</BrowserRouter>
    </CartContext.Provider>
  </ProductProvider>
);

/**
 * Custom render function for components
 */
const customRender = (ui: React.ReactElement) => render(ui, { wrapper: AllProviders });

/**
 * Custom render function for hooks
 */
const customRenderHook = <T,>(
  hook: () => T,
  cartProviderInitialValue?: CartContextType
) =>
  renderHook(hook, {
    wrapper: ({ children }) => (
      <AllProviders cartProviderInitialValue={cartProviderInitialValue}>{children}</AllProviders>
    ),
  });

declare global {
  var render: typeof customRender;
  var renderHookWithProviders: typeof customRenderHook;
}

global.render = customRender;
global.renderHookWithProviders = customRenderHook;
