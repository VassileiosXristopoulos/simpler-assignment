import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatPrice } from 'utilities/currency';
import { Button } from '../buttons/Button';
import { useProductContext } from 'contexts/ProductContext';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value, 10);
    console.log("quantity:"+ quantity)
    if (!isNaN(quantity) && quantity > 0) {
      onQuantityChange(item.productId, quantity);
    }
  };
  const { products } = useProductContext()
  const product = products[item.productId];
  
  return (
    <div className="flex items-center justify-between py-2 border-b">
      <div className="flex-1">
        <h3 className="font-medium">{product?.name}</h3>
        <p className="text-gray-600">
          {formatPrice(product?.price)} each
        </p>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="number"
          min="1"
          max={product?.stock}
          value={item.quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          className="w-16 px-2 py-1 border rounded-md"
        />
        <Button
          onClick={() => onRemove(item.productId)}
          className="text-red-500 hover:text-red-700"
          icon={<Trash2 size={18} />}
        >
          <span className="sr-only">Remove {product?.name} from cart</span>
        </Button>
      </div>
    </div>
  );
}
