import React from 'react';
import { Header } from '../components/Header';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { useCart } from 'components/cart/useCart';
import { CartSidebar } from 'components/cartSidebar/CartSidebar';
import { useCartContext } from 'contexts/CartContext';

interface DefaultLayoutProps {
  children: React.ReactNode;
  cartVisible?: boolean;
  title?: string;
  backButtonText?: string;
  backButtonPath?: string;
}

export function DefaultLayout({
  children,
  cartVisible = true,
  title,
  backButtonText,
  backButtonPath
}: DefaultLayoutProps) {
  const { cartIsOpen } = useCartContext();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        cartVisible={cartVisible}
        title={title}
        backButtonText={backButtonText}
        backButtonPath={backButtonPath}
      />
      
      {cartVisible && <CartSidebar isOpen={cartIsOpen} />}

      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </ErrorBoundary>
    </div>
  );
}
