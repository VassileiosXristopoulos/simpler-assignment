import { act } from "@testing-library/react";
import { createCart, getCart, updateCart } from "api/cartApi";
import { addOrder } from "api/orderApi";
import { useCart } from "components/cart/useCart";
import { Cart, Product } from "types";
import { CART_ID_KEY } from "utilities/constants";
import { vi } from "vitest";
import { customRenderHook } from "setupTest";

const mockedUsedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedUsedNavigate,
}));

vi.mock("api/cartApi", () => ({
  createCart: vi.fn(),
  updateCart: vi.fn(),
  getCart: vi.fn(),
}));

vi.mock("api/orderApi", () => ({
  addOrder: vi.fn(),
}));

const mockProduct: Product = {
  id: "p1",
  name: "Test Product",
  price: 100,
  stock: 5,
};

const mockCart: Cart = {
  id: "cart123",
  items: {},
};

describe("useCart", () => {
  it("should initialize the cart if no valid cart ID exists", async () => {
    localStorage.removeItem(CART_ID_KEY);
    (createCart as jest.Mock).mockResolvedValue("newCart123");
    (getCart as jest.Mock).mockResolvedValue(mockCart);

    const mockSetCart = vi.fn();
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCart,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: mockSetCart,
      setCartError: vi.fn(),
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });
    await act(async () => {
      await result.current.initializeCart();
    });

    expect(createCart).toHaveBeenCalled();
    expect(getCart).toHaveBeenCalledWith("newCart123");
    expect(mockSetCart).toHaveBeenCalledWith(mockCart);
  });

  it("should handle generic errors in initializeCart", async () => {
    (getCart as jest.Mock).mockRejectedValue(new Error("Failed to fetch cart"));

    const mockSetCartError = vi.fn();
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCart,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: vi.fn(),
      setCartError: mockSetCartError,
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });

    await act(async () => {
      await result.current.initializeCart();
    })

    expect(mockSetCartError).toHaveBeenCalledWith("Error while initializing the Cart: Error: Failed to fetch cart");
  });

  it("should remove localStorage cartId on 404 error", async () => {
    localStorage.setItem(CART_ID_KEY, mockCart.id);
    (getCart as jest.Mock).mockRejectedValue(new Error("404 Not Found"));

    const mockSetCartError = vi.fn();
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCart,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: vi.fn(),
      setCartError: mockSetCartError,
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });

    await act(async () => {
      await result.current.initializeCart();
    })

    expect(localStorage.getItem(CART_ID_KEY)).toBeNull();
  });

  it("should add a product to an empty cart", async () => {
    const mockEmptyCart: Cart = {
      id: "cart123",
      items: null,
    };
    (updateCart as jest.Mock).mockResolvedValue({
      ...mockCart,
      items: {
        [mockProduct.id]: { productId: mockProduct.id, quantity: 1 }
      },
    });

    const mockSetCart = vi.fn();
    const { result } = customRenderHook(() => useCart(), {
      cart: mockEmptyCart,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: mockSetCart,
      setCartError: vi.fn(),
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });

    await act(async () => {
      await result.current.addToCart(mockProduct);
    });
    expect(updateCart).toHaveBeenCalledWith(mockCart.id, {
      [mockProduct.id]: { productId: mockProduct.id, quantity: 1 },
    });
    expect(mockSetCart).toBeCalledWith({ id: mockEmptyCart.id, items: { [mockProduct.id]: { productId: mockProduct.id, quantity: 1 } } })
  });

  it("should increase the quantity if the product is already in the cart", async () => {
    const mockCartWithItem: Cart = {
      id: "cart123",
      items: { [mockProduct.id]: { productId: mockProduct.id, quantity: 1 } },
    };

    // // mocks what the api returns
    (updateCart as jest.Mock).mockResolvedValue({
      ...mockCartWithItem,
      items: { [mockProduct.id]: { productId: mockProduct.id, quantity: 2 } },
    });

    const mockSetCart = vi.fn();
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCartWithItem,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: mockSetCart,
      setCartError: vi.fn(),
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });

    await act(async () => {
      await result.current.addToCart(mockProduct);
    });

    expect(updateCart).toHaveBeenCalledWith(mockCart.id, {
      [mockProduct.id]: { productId: mockProduct.id, quantity: 2 },
    });
    expect(mockSetCart).toBeCalledWith({ id: mockCartWithItem.id, items: { [mockProduct.id]: { productId: mockProduct.id, quantity: 2 } } })
  });

  it("should handle API errors gracefully", async () => {
    (updateCart as jest.Mock).mockRejectedValue(new Error("Failed to update cart"));

    const mockSetCartError = vi.fn();
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCart,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: vi.fn(),
      setCartError: mockSetCartError,
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });

    await act(async () => {
      await result.current.addToCart(mockProduct);
    });
    expect(mockSetCartError).toBeCalledTimes(1);
  });

  it("should update item quantity in the cart", async () => {
    const mockCartWithItem: Cart = {
      id: mockCart.id,
      items: { [mockProduct.id]: { productId: mockProduct.id, quantity: 1 } },
    };

    (updateCart as jest.Mock).mockResolvedValue({
      ...mockCartWithItem,
      items: { [mockProduct.id]: { productId: mockProduct.id, quantity: 3 } },
    });

    const mockSetCart = vi.fn();
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCartWithItem,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: mockSetCart,
      setCartError: vi.fn(),
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });

    await act(async () => {
      await result.current.updateQuantity(mockProduct.id, 3);
    });

    expect(updateCart).toHaveBeenCalledWith(mockCart.id, {
      [mockProduct.id]: { productId: mockProduct.id, quantity: 3 },
    });
    expect(mockSetCart).toHaveBeenCalledWith({
      id: mockCart.id,
      items: { [mockProduct.id]: { productId: mockProduct.id, quantity: 3 } },
    });
  });

  it("should handle errors in updateQuantity", async () => {
    (updateCart as jest.Mock).mockRejectedValue(new Error("Failed to update quantity"));

    const mockSetCartError = vi.fn();
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCart,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: vi.fn(),
      setCartError: mockSetCartError,
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });


    await act(async () => {
      await result.current.updateQuantity("p1", 3);
    });

    expect(mockSetCartError).toHaveBeenCalledWith("Error while updating Cart item quantity: Failed to update quantity");
  });

  it("should remove an item from the cart", async () => {
    const mockCartWithItem: Cart = {
      id: mockCart.id,
      items: { [mockProduct.id]: { productId: mockProduct.id, quantity: 1 } },
    };

    (updateCart as jest.Mock).mockResolvedValue({ id: mockCart.id, items: {} });

    const mockSetCart = vi.fn();
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCartWithItem,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: mockSetCart,
      setCartError: vi.fn(),
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });

    await act(async () => {
      await result.current.removeItem(mockProduct.id);
    });

    expect(updateCart).toHaveBeenCalledWith(mockCart.id, {});
    expect(mockSetCart).toHaveBeenCalledWith({ id: mockCart.id, items: {} });
  });

  it("should handle errors in removeItem", async () => {
    (updateCart as jest.Mock).mockRejectedValue(new Error("Failed to remove item"));

    const mockSetCartError = vi.fn();
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCart,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: vi.fn(),
      setCartError: mockSetCartError,
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });

    await act(async () => {
      await result.current.removeItem(mockProduct.id);
    });

    expect(mockSetCartError).toHaveBeenCalledWith("Error while removing from Cart: Failed to remove item");
  });
  
  it("should complete checkout and navigate to success page", async () => {
    (addOrder as jest.Mock).mockResolvedValue(true);
    const mockClearCart = vi.fn();
    const mockSetCartIsOpen = vi.fn();
  
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCart,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: mockSetCartIsOpen,
      updateCart: vi.fn(),
      setCart: vi.fn(),
      setCartError: vi.fn(),
      clearCart: mockClearCart,
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });
  
    await act(async () => {
      await result.current.onCheckout();
    });
  
    expect(addOrder).toHaveBeenCalledWith(mockCart.id, "");
    expect(mockClearCart).toHaveBeenCalled();
    expect(mockSetCartIsOpen).toHaveBeenCalledWith(false);
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/order-success");
  });
  
  it("should handle checkout failure", async () => {
    (addOrder as jest.Mock).mockRejectedValue(new Error("Checkout failed"));
  
    const { result } = customRenderHook(() => useCart(), {
      cart: mockCart,
      cartIsOpen: false,
      cartError: "",
      selectedDiscount: null,
      setCartIsOpen: vi.fn(),
      updateCart: vi.fn(),
      setCart: vi.fn(),
      setCartError: vi.fn(),
      clearCart: vi.fn(),
      setSelectedDiscount: vi.fn(),
      clearDiscount: vi.fn()
    });
  
    await expect(result.current.onCheckout()).rejects.toThrow("error completing order");
  });
});


