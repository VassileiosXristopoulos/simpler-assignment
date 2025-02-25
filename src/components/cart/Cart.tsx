import { useEffect, useMemo } from 'react';
import { formatPrice, getDiscountValue } from 'utilities/utils';
import { useCart } from './useCart';
import { Button } from '../buttons/Button';
import { CartItem } from './CartItem';
import DiscountSelector from 'components/DiscountSelector';
import { useCartContext } from 'contexts/CartContext';

export function Cart() {
  const {
    onCheckout,
    updateQuantity,
    removeItem,
    subtotal,
    initializeCart
  } = useCart();

  const { cart, cartError, selectedDiscount, setSelectedDiscount, clearDiscount } = useCartContext();
  const discountValue = useMemo(() => getDiscountValue({ selectedDiscount, total: subtotal }),
    [selectedDiscount, subtotal]);

  useEffect(() => {
    if (!cart?.id) {
      initializeCart();
    }
  }, [])

  if (cartError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">{cartError}</p>
      </div>
    );
  }

  if (!cart || Object.keys(cart.items ?? {}).length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-center">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {Object.values(cart?.items ?? {}).map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            onQuantityChange={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <DiscountSelector
          selectedDiscount={selectedDiscount}
          onApplyDiscount={(discount) => setSelectedDiscount(discount)}
          onRemoveDiscount={clearDiscount} />
      </div>

      <div className="mt-6">
        <div className="space-y-2 text-right">
          <p className="text-gray-600">
            Subtotal: {formatPrice(subtotal)}
          </p>
          {selectedDiscount && (
            <p className="text-green-600">
              Discount: -{formatPrice(discountValue)}
            </p>
          )}
          <p className="text-xl font-semibold">
            Total: {formatPrice(Math.max(0, subtotal - discountValue))}
          </p>
        </div>

        <Button
          onClick={onCheckout}
          className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
