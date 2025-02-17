import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, ArrowLeft } from 'lucide-react';
import CartButton from './buttons/CartButton';

interface HeaderProps {
  cartVisible?: boolean;
  title?: string;
  backButtonText?: string;
  backButtonPath?: string;
}

export function Header({ cartVisible = true, title, backButtonText, backButtonPath }: HeaderProps) {
  const navigate = useNavigate();
  
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
          <CartButton 
            icon={<ShoppingCart size={24} />}
           />
        </div>
      )}
    </div>
  );
}
