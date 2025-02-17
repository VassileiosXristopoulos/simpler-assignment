export interface RouterType {
  title: string;
  path: string;
  element: JSX.Element;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartItemAPI {
  product_id: string;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface CartAPI {
  id: string;
  items: CartItemAPI[];
  discountCode?: string;
  subtotal: number;
  discount: number;
  total: number;
}

export interface Discount {
  code: string;
  amount: number;
  type: "FLAT" | "PERCENTAGE" | "BOGO";
}
