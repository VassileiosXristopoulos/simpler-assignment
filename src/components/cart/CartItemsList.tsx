import { CartItem as CartItemType } from 'types';
import { CartItem } from './CartItem';

interface CartItemListProps {
  cartItems: Record<string, CartItemType>;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
}

const CartItemList: React.FC<CartItemListProps> = ({ cartItems, updateQuantity, removeItem }) => (
  <div className="space-y-4">
    {Object.values(cartItems).map((item) => (
      <CartItem
        key={item.productId}
        item={item}
        onQuantityChange={updateQuantity}
        onRemove={removeItem}
      />
    ))}
  </div>
);

export default CartItemList;
