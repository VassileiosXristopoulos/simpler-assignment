import { vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { useCartContext } from 'contexts/CartContext';
import { ProductCard } from 'components/cards/ProductCard/ProductCard';
import { customRender as render } from 'setupTest';

// Mock context to simulate cart state
vi.mock('contexts/CartContext', () => ({
  useCartContext: vi.fn(),
}));

const PRODUCT_INITIAL_CART_QUANTITY = 2;
const PRODUCT_STOCK = 5;
describe('ProductCard component', () => {
  const product = {
    id: '1',
    name: 'Product 1',
    price: 100,
    stock: PRODUCT_STOCK,
  };

  const onAddToCart = vi.fn();

  beforeEach(() => {
    (useCartContext as jest.Mock).mockReturnValue({
      cart: {
        items: [
          { [product.id]: { productId: product.id, quantity: PRODUCT_INITIAL_CART_QUANTITY } }
        ]
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the product information correctly', () => {
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText(`${product.stock} available`)).toBeInTheDocument();
  });

  it('disables the "Add to Cart" button when product is out of stock', () => {
    (useCartContext as jest.Mock).mockReturnValue({
      cart: {
        items: {
          [product.id]: { productId: product.id, quantity: product.stock }
        }
      }
    });

    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Max Quantity');
  });

  it('calls onAddToCart with the correct product when the button is clicked', () => {
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onAddToCart).toHaveBeenCalledWith(product);
  });

  it('should have correct styles when the button is disabled', () => {
    (useCartContext as jest.Mock).mockReturnValue({
      cart: {
        items: {
          [product.id]: { productId: product.id, quantity: PRODUCT_STOCK }
        }
      }
    });

    render(<ProductCard product={product} onAddToCart={onAddToCart} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-400');
  });

  it('should update cart item availability when stock changes', async () => {
    const { rerender } = render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    (useCartContext as jest.Mock).mockReturnValue({
      cart: {
        items: { [product.id]: { productId: product.id, quantity: PRODUCT_INITIAL_CART_QUANTITY + 1 } }
      }
    });

    rerender(<ProductCard product={{ ...product }} onAddToCart={onAddToCart} />);
    expect(screen.getByText(`${PRODUCT_STOCK - PRODUCT_INITIAL_CART_QUANTITY - 1} available`)).toBeInTheDocument();
  });

  it('should display "Maximum quantity in cart" if cart exceeds stock', () => {
    const overstockCart = {
      cart: {
        items: { [product.id]: { productId: product.id, quantity: PRODUCT_STOCK + 1 } }
      }
    };

    (useCartContext as jest.Mock).mockReturnValue(overstockCart);
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    expect(screen.getByText('Maximum quantity in cart')).toBeInTheDocument();
  });

  it('should handle the scenario when no items are in the cart', () => {
    (useCartContext as jest.Mock).mockReturnValue({
      cart: { items: [] }
    });

    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
  });
});
