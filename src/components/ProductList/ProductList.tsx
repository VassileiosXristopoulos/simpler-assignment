import { Product } from '../../types';
import { ProductCard } from 'components/cards/ProductCard';

interface ProductListProps {
  products: Record<string, Product>;
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, onAddToCart }: ProductListProps) {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(products).map(([productId, product]) => (
        <ProductCard
          key={productId}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}