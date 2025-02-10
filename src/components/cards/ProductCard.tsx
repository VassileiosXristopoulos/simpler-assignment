import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { Button } from 'components/buttons/Button';
import { useCart } from 'components/cart/useCart';
import { useCallback, useMemo } from 'react';
import React from 'react';
import { formatPrice } from 'utilities/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = React.memo(({ product, onAddToCart }: ProductCardProps) => {
  const { cartItems } = useCart();

  const { isOutOfStock, formattedPrice } = useMemo(() => {
    const cartItem = cartItems.find(item => item.productId === product.id);
    const quantity = cartItem?.quantity || 0;
    
    return {
      isOutOfStock: quantity >= product.stock,
      formattedPrice: formatPrice(product.price)
    };
  }, [cartItems, product.id, product.stock, product.price]);

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
          <p className="text-sm text-gray-500">
            {product.stock} in stock
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
          Add to Cart
        </Button>
      </div>
    </div>
  );
});

// Set display name for easier debugging
ProductCard.displayName = "ProductCard";

export { ProductCard };
