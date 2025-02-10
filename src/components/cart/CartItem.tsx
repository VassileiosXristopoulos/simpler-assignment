import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from 'utilities/currency';
import { Button } from '../buttons/Button';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      onQuantityChange(item.productId, quantity);
    }
  };

  return (
    <div className="flex items-center justify-between py-2 border-b">
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
          onChange={(e) => handleQuantityChange(e.target.value)}
          className="w-16 px-2 py-1 border rounded-md"
        />
        <Button
          onClick={() => onRemove(item.productId)}
          className="text-red-500 hover:text-red-700"
          icon={<Trash2 size={18} />}
        >
          <span className="sr-only">Remove {item.product.name} from cart</span>
        </Button>
      </div>
    </div>
  );
}
