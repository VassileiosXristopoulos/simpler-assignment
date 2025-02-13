import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, ArrowLeft } from 'lucide-react';
import { Button } from './buttons/Button';
import { useCart } from './cart/useCart';
import { formatPrice } from 'utilities/currency';
import { useCartContext } from 'contexts/CartContext';

interface HeaderProps {
  cartVisible?: boolean;
  title?: string;
  backButtonText?: string;
  backButtonPath?: string;
}

export function Header({ cartVisible = true, title, backButtonText, backButtonPath }: HeaderProps) {
  const navigate = useNavigate();
  const { total } = useCart();
  const { setCartIsOpen } = useCartContext();
  
  return (
    <div className="relative z-30">
      <div className="max-w-7xl mx-auto p-6 flex items-center gap-4">
        {backButtonPath && (
          <button
            onClick={() => navigate(backButtonPath)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            {backButtonText || 'Back'}
          </button>
        )}
        {title && (
          <h1 className="text-2xl font-bold text-gray-800">
            {title}
          </h1>
        )}
      </div>
      {cartVisible && (
        <div className="fixed top-4 right-4">
          <Button
            onClick={() => setCartIsOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors relative flex items-center gap-2"
            icon={<ShoppingCart size={24} />}
          >
            <span className="ml-2 font-medium">
              {formatPrice(total)}
            </span>
            <span className="sr-only">Open cart</span>
          </Button>
        </div>
      )}
    </div>
  );
}
