import "@testing-library/jest-dom";
import { ProductProvider } from 'contexts/ProductContext';
import { CartProvider } from "contexts/CartContext";
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
/**
 * 
 * 1. Test Button component, icon is rendered, text is rendered, onclick is called, is disabled when should be disabled
 * 2. Test price formatting that is happening correctly
 * 3. Functional test the card component, case with out of stock, case with stock, case with no data in product or invalid data
 */

const customRender = (ui: React.ReactElement) =>
  render(
    <ProductProvider>
      <CartProvider>
        <BrowserRouter>{ui}</BrowserRouter>
      </CartProvider>
    </ProductProvider>
  );
declare global {
  var render: typeof customRender;
}

global.render = customRender;
