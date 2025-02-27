import { useMemo } from 'react';
import { formatPrice } from 'utilities/utils';
import { useCartContext } from 'contexts/CartContext';
import { Product } from 'types';

export function useCartItemDetails (product: Product) {
  const { cart } = useCartContext();
  return useMemo(() => {
    if (!cart?.items) {
      return {
        isOutOfStock: false,
        availableStock: product.stock,
        formattedPrice: formatPrice(product.price)
      };
    }

    const cartItem = cart.items[product.id] || null;
    const quantity = cartItem?.quantity ?? 0;
    return {
      isOutOfStock: quantity >= product.stock,
      availableStock: Math.max(0, product.stock - quantity),
      formattedPrice: formatPrice(product.price)
    };
  }, [cart?.items, product.id, product.stock, product.price]);
};
