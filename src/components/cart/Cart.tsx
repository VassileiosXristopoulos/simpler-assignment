import { useEffect, useMemo } from 'react';
import { getDiscountValue } from 'utilities/utils';
import { useCart } from './useCart';
import { Button } from '../buttons/Button';
import DiscountSelector from 'components/DiscountSelector/DiscountSelector';
import { useCartContext } from 'contexts/CartContext';
import PriceSummary from './PriceSummary';
import { useCheckout } from 'hooks/useCheckout';
import CartItemList from './CartItemsList';

export function Cart() {
  const {
    onCheckout,
    updateQuantity,
    removeItem,
    subtotal,
    initializeCart,
    totalItems
  } = useCart();

  const { cart, cartError, selectedDiscount, setSelectedDiscount, clearDiscount } = useCartContext();
  const discountValue = useMemo(() => getDiscountValue({ selectedDiscount, total: subtotal, totalItems: totalItems }),
    [selectedDiscount, subtotal]);
  const { isSubmitting: checkoutInProgress, error: checkoutError, handleCheckout } = useCheckout(onCheckout);


  useEffect(() => {
    if (!cart?.id) {
      initializeCart();
    }
  }, [])

  if (!cart || Object.keys(cart.items ?? {}).length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-center">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {cartError && <div className="p-4 text-center">
        <p className="text-red-600">{cartError}</p>
      </div>}
      
      <CartItemList
        cartItems={cart.items}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />

      <div className="mt-6 border-t pt-4">
        <DiscountSelector
          selectedDiscount={selectedDiscount}
          onApplyDiscount={(discount) => setSelectedDiscount(discount)}
          onRemoveDiscount={clearDiscount} />
      </div>

      <div className="mt-6">
        <PriceSummary subtotal={subtotal} discountValue={discountValue} selectedDiscount={selectedDiscount} />

        <Button
          onClick={handleCheckout}
          disabled={checkoutInProgress || cartError.length > 0}
          className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
        >
          Checkout
        </Button>
        {checkoutError && (
          <p className="mt-4 text-red-600 text-center">{checkoutError}</p>
        )}
      </div>
    </div>
  );
}
