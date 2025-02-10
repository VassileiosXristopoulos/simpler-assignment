import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { Button } from 'components/buttons/Button';
// import { formatPrice } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col transform transition-transform hover:scale-[1.02]">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
      <div className="flex justify-between items-center mt-auto">
        <div className="space-y-1">
          <span className="text-xl font-bold text-blue-600">
            {/* {formatPrice(product.price)} */}
            {product.price}
          </span>
          <p className="text-sm text-gray-500">
            {product.stock} in stock
          </p>
        </div>
        <Button
          icon={<ShoppingCart size={20} />}
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 px-4 py-2"
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}
