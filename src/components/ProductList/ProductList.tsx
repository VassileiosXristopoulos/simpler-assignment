import React from 'react';
import { Product } from '../../types';
import { ProductCard } from 'components/cards/ProductCard';
import { useCart } from 'components/cart/useCart';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, onAddToCart }: ProductListProps) {
  const { cart } = useCart();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          cartItems={cart?.items || []}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}