import { memo, useMemo, useCallback } from 'react';
import { Product } from '../../types';
import { formatPrice } from 'utilities/utils';
import { useCartContext } from 'contexts/CartContext';
import { ProductInfo } from './ProductInfo';
import BaseCard from './BaseCard';
import { AddToCartButton } from 'components/buttons/AddToCardButton';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = memo(({ product, onAddToCart }: ProductCardProps) => {
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
