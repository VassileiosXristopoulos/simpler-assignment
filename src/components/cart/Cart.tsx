import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatPrice } from 'utilities/currency';
import { useCart } from './useCart';
import { Button } from '../buttons/Button';

export function Cart() {
  const {
    cartItems,
    selectedDiscount,
    subtotal,
    discount,
    total,
    updateCartQuantity,
    removeFromCart,
    applyDiscount,
    clearCart
  } = useCart();

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      updateCartQuantity(productId, quantity);
    }
  };

  return (
    <div className="p-4">
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between py-2 border-b"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600">
                    {formatPrice(item.product.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max={item.product.stock}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                    className="w-16 px-2 py-1 border rounded-md"
                  />
                  <Button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:text-red-700"
                    icon={<Trash2 size={18} />}
                  >
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              </div>
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
              onClick={clearCart}
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
