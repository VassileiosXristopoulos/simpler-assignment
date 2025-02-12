import { X } from 'lucide-react';
import { Button } from '../buttons/Button';
import { Cart } from 'components/cart/Cart';
import { useCart } from 'components/cart/useCart';

interface CartSidebarProps {
  isOpen: boolean;
}

export function CartSidebar({ isOpen }: CartSidebarProps) {
  const { setCartIsOpen } = useCart();

  return (
    <>
      {/* Cart Slide-out Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <Button
              onClick={() => setCartIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              icon={<X size={24} />}
            >
              <span className="sr-only">Close cart</span>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Cart />
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={()=> setCartIsOpen(false)}
        />
      )}
    </>
  );
}
