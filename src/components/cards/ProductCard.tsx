import { memo, useCallback } from 'react';
import { Product } from '../../types';
import { useCartContext } from 'contexts/CartContext';
import { ProductInfo } from './ProductInfo';
import BaseCard from './BaseCard';
import { AddToCartButton } from 'components/buttons/AddToCardButton';
import { useCartItemDetails } from 'hooks/useCartItemDetails';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = memo(({ product, onAddToCart }: ProductCardProps) => {
  const { cart } = useCartContext();

  const { isOutOfStock, availableStock, formattedPrice } = useCartItemDetails(product);

  // Memoize click handler
  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [onAddToCart, product]);

  return (
    <BaseCard>
      <ProductInfo
        name={product.name}
        formattedPrice={formattedPrice}
        availableStock={availableStock}
        isOutOfStock={isOutOfStock}
      />
      <div className="flex justify-between items-center mt-2">
        <AddToCartButton
          onAddToCart={handleAddToCart}
          isOutOfStock={isOutOfStock}
          isCartAvailable={!!cart}
        />
      </div>
    </BaseCard>
  );
});
ProductCard.displayName = "ProductCard";
