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
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
  discountCode?: string;
  subtotal: number;
  discount: number;
  total: number;
}

export interface Discount {
  code: string;
  amount: number;
  type: string;
}
