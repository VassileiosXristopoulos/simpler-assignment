import { useEffect } from 'react';
import { formatPrice } from 'utilities/utils';
import { useCart } from './useCart';
import { Button } from '../buttons/Button';
import { CartItem } from './CartItem';
import DiscountSelector from 'components/DiscountSelector';

export function Cart() {
  const {
    cart,
    // isLoading,
    onCheckout,
    discounts,
    error,
    updateQuantity,
    removeItem,
    total,
    subtotal,
    selectedDiscount,
    setSelectedDiscount,
    discountValue,
    initializeCart
  } = useCart();


  useEffect(() => {
    if(!cart?.id) {
      console.log("Cart useEffect")
      initializeCart();
    }
  },[])

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!cart || cart?.items?.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-center">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {cart?.items?.map((item) => (
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
          discounts={discounts}
          onApplyDiscount={(discount) => setSelectedDiscount(discount)}
          onRemoveDiscount={() => setSelectedDiscount(null)} />
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
            Total: {formatPrice(Math.max(0, total - discountValue))}
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
