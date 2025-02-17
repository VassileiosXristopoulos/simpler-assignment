import { Button } from './Button'
import { formatPrice } from 'utilities/utils';
import { useCart } from 'components/cart/useCart';
import { useCartContext } from 'contexts/CartContext';
type CartButtonProps = {
  onClick?: () => void,
  className?: string;
  icon?: JSX.Element;
}
export default function CartButton({ onClick, className, icon }: CartButtonProps) {
  const { total } = useCart();
  const { setCartIsOpen, cartError } = useCartContext();

  /**
   * Cart button has default behaviour for click action, that can be overriden
   */
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setCartIsOpen(true)
    }
  }

  return (
    <Button
      onClick={handleClick}
      className={`bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors relative flex items-center gap-2 ${className}`}
      icon={icon}
    >
      {cartError && (
        <div className="absolute -top-2 -left-2 bg-red-600 text-white text-sm font-bold w-5 h-5 flex items-center justify-center rounded-full">
          !
        </div>
      )}
      <span className="ml-2 font-medium">
        {formatPrice(total)}
      </span>
      <span className="sr-only">Open cart</span>
    </Button>
  )
}
