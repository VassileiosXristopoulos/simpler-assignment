import { memo } from "react";
import { Button } from "./Button";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  onAddToCart: () => void;
  isOutOfStock: boolean;
  isCartAvailable: boolean;
}

export const AddToCartButton = memo(({ onAddToCart, isOutOfStock, isCartAvailable }: AddToCartButtonProps) => (
  <Button
    icon={<ShoppingCart size={20} />}
    onClick={onAddToCart}
    disabled={isOutOfStock || !isCartAvailable}
    className={`
      inline-flex items-center justify-center gap-2 
      font-medium rounded-md transition-all 
      px-4 py-2
      ${isOutOfStock || !isCartAvailable
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-75 hover:bg-gray-200 transform-none shadow-none'
        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'}
    `}
  >
    {isOutOfStock ? 'Max Quantity' : 'Add to Cart'}
  </Button>
));
