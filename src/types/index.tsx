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

export interface Discount {
  code: string;
  amount: number;
}
