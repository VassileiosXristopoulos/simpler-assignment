import { act } from "@testing-library/react";
import { updateCart } from "api/cartApi";
import { useCart } from "components/cart/useCart";
import { Cart, Product } from "types";
import { vi } from "vitest";

const mockedUsedNavigate = vi.fn();  //keep it at top of file

//Here we are mocking partially means only useNavigate we are mocking and remaining we are required actual.
beforeEach(() => {
  vi.mock('react-router', () => {
    return {
      ...vi.importActual('react-router'),  // for vitest 
      ...jest.requireActual('react-router'), // for jest
      useNavigate: () => mockedUsedNavigate,
    };
  });
});

vi.mock('api/cartApi', () => ({
  createCart: vi.fn(),
  updateCart: vi.fn(),
  getDiscounts: vi.fn(),
}));

// Mock Product Data
const mockProduct: Product = {
  id: "p1",
  name: "Test Product",
  price: 100,
  stock: 5
};

// Mock Cart Context Provider
const mockCart: Cart = {
  id: "cart123",
  items: [],
};


describe("useCart - addToCart", () => {

  it("should add a product to an empty cart", async () => {
    const mockEmptyCart: Cart = {
      id: "cart123",
      items: [],
    };
    (updateCart as jest.Mock).mockResolvedValue({
      data: {
        ...mockCart,
        items: [{ productId: mockProduct.id, quantity: 1 }],
      },
    });

    const mockSetCart = vi.fn();
    const { result } = global.renderHookWithProviders(() => useCart(), {
      cart: mockEmptyCart,
      setCart: mockSetCart,
      updateCart: vi.fn(),
      setCartIsOpen: vi.fn(),
      clearCart: vi.fn(),
      setCartError: vi.fn(),
      cartError: '',
      cartIsOpen: false
    });

    await act(async () => {
      await result.current.addToCart(mockProduct);
    });
    expect(updateCart).toHaveBeenCalledWith("cart123", [
      { productId: mockProduct.id, quantity: 1 },
    ]);
    expect(mockSetCart).toBeCalledWith({ id: mockEmptyCart.id, items: [{ productId: mockProduct.id, quantity: 1 }] })
  });

  it("should increase the quantity if the product is already in the cart", async () => {
    const mockCartWithItem: Cart = {
      id: "cart123",
      items: [{ productId: mockProduct.id, quantity: 1 }],
    };

    // // mocks what the api returns
    (updateCart as jest.Mock).mockResolvedValue({
      data: {
        ...mockCartWithItem,
        items: [{ productId: mockProduct.id, quantity: 2 }],
      },
    });

    const mockSetCart = vi.fn();
    const { result } = global.renderHookWithProviders(() => useCart(), {
      cart: mockCartWithItem,
      setCart: mockSetCart,
      updateCart: vi.fn(),
      setCartIsOpen: vi.fn(),
      clearCart: vi.fn(),
      setCartError: vi.fn(),
      cartError: '',
      cartIsOpen: false
    });

    await act(async () => {
      await result.current.addToCart(mockProduct);
    });

    expect(updateCart).toHaveBeenCalledWith("cart123", [
      { productId: mockProduct.id, quantity: 2 },
    ]);
    expect(mockSetCart).toBeCalledWith({ id: mockCartWithItem.id, items: [{ productId: mockProduct.id, quantity: 2 }] })
  });

  it("should handle API errors gracefully", async () => {
    (updateCart as jest.Mock).mockRejectedValue(new Error("Failed to update cart"));

    const mockSetCartError = vi.fn();
    const { result } = global.renderHookWithProviders(() => useCart(), {
      cart: { id: 'cart123', items: [] },
      setCart: vi.fn(),
      updateCart: vi.fn(),
      setCartIsOpen: vi.fn(),
      clearCart: vi.fn(),
      setCartError: mockSetCartError,
      cartError: '',
      cartIsOpen: false
    });

    await act(async () => {
      await result.current.addToCart(mockProduct);
    });
    expect(mockSetCartError).toBeCalledTimes(1);
  });
});
