import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Router from 'pages/Router';
import pagesData from 'router/pages';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { CartProvider } from 'contexts/CartContext';
import { ProductProvider } from 'contexts/ProductContext';


function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Router pages={pagesData} />
          </ErrorBoundary>
        </BrowserRouter>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
