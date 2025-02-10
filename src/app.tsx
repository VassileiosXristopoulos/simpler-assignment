import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Router from 'pages/Router';
import pagesData from 'router/pages';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { CartProvider } from 'contexts/CartContext';


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Router pages={pagesData} />
        </ErrorBoundary>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
