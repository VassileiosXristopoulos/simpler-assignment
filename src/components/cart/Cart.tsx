import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from 'utilities/currency';
import { useCart } from './useCart';
import { Button } from '../buttons/Button';
import { CartItem } from './CartItem';
import { useProductContext } from 'contexts/ProductContext';

export function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    isLoading,
    error,
    updateQuantity,
    removeItem,
    total, 
    subtotal,
    totalItems
  } = useCart();
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading cart...</p>
      </div>
    );
  }

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

      <div className="mt-6">
        <div className="space-y-2 text-right">
          <p className="text-gray-600">
            Subtotal: {formatPrice(subtotal)}
          </p>
          {/* {cart?.discount > 0 && (
            <p className="text-green-600">
              Discount: -{formatPrice(discount)}
            </p>
          )} */}
          <p className="text-xl font-semibold">
            Total: {formatPrice(total)}
          </p>
        </div>

        <Button
          onClick={() => navigate('/checkout')}
          className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
