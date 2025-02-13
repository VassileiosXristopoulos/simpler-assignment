import { memo, useMemo, useCallback } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../buttons/Button';
import { formatPrice } from 'utilities/currency';
import { useCartContext } from 'contexts/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = memo(function ProductCard({ 
  product, 
  onAddToCart 
}: ProductCardProps) {
  // TODO: flickering of disabled button on refresh
  const { cart } = useCartContext();
  // Memoize cart-related calculations
  const { isOutOfStock, availableStock, formattedPrice } = useMemo(() => {
    // TODO: optionally make cart items object with id keys
    const cartItem = cart?.items.find(item => item.productId === product.id);
    const quantity = cartItem?.quantity || 0;
    return {
      isOutOfStock: quantity >= product.stock,
      availableStock: product.stock - quantity,
      formattedPrice: formatPrice(product.price)
    };
  }, [cart?.items, product.id, product.stock, product.price]);

  // Memoize click handler
  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [onAddToCart, product]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col transform transition-transform hover:scale-[1.02]">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
      <div className="flex justify-between items-center mt-auto">
        <div className="space-y-1">
          <span className="text-xl font-bold text-blue-600">
            {formattedPrice}
          </span>
          <p className={`text-sm ${isOutOfStock ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            {isOutOfStock 
              ? 'Maximum quantity in cart' 
              : `${availableStock} available`}
          </p>
        </div>
        <Button
          icon={<ShoppingCart size={20} />}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`
            inline-flex items-center justify-center gap-2 
            font-medium rounded-md transition-all 
            px-4 py-2
            ${isOutOfStock
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-75 hover:bg-gray-200 transform-none shadow-none'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'}
          `}
        >
          {isOutOfStock ? 'Max Quantity' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
});
