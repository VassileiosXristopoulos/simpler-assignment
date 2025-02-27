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
  items: Record<string, CartItem> | null;
}

export interface CartAPI {
  id: string;
  items: CartItemAPI[];
  discountCode?: string;
  subtotal: number;
  discount: number;
  total: number;
}

export interface FlatDiscount {
  code: string;
  amount: number;
  type: "FLAT";
}

export interface PercentageDiscount {
  code: string;
  amount: number;
  type: "PERCENTAGE";
}

export interface BogoDiscount {
  code: string;
  amount?: never;
  type: "BOGO";
}

export type Discount = FlatDiscount | PercentageDiscount | BogoDiscount;
