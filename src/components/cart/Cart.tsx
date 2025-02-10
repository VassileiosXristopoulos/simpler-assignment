import { formatPrice } from 'utilities/currency';
import { useCart } from './useCart';
import { Button } from '../buttons/Button';
import { CartItem } from './CartItem';
import { useNavigate } from 'react-router-dom';

export function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    selectedDiscount,
    subtotal,
    discount,
    total,
    updateCartQuantity,
    removeFromCart,
    applyDiscount,
    clearCart,
    setIsOpen
  } = useCart();

  const handleCheckout = () => {
    clearCart();
    setIsOpen(false);
    navigate('/order-success');
  };
  
  return (
    <div className="p-4">
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onQuantityChange={updateCartQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>
          <div className="mt-6">
            <select
              value={selectedDiscount || ''}
              onChange={(e) => applyDiscount(e.target.value || undefined)}
              className="w-full p-2 border rounded-md mb-4"
            >
              <option value="">Select a discount code</option>
              <option value="SAVE10">SAVE10 ($10 off)</option>
              <option value="SPRING25">SPRING25 ($25 off)</option>
            </select>

            <div className="space-y-2 text-right">
              <p className="text-gray-600">
                Subtotal: {formatPrice(subtotal)}
              </p>
              {discount > 0 && (
                <p className="text-green-600">
                  Discount: -{formatPrice(discount)}
                </p>
              )}
              <p className="text-xl font-semibold">
                Total: {formatPrice(total)}
              </p>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
