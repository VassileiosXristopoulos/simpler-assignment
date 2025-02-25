import { Product } from "types";

export const adaptProductsFromApi = (productsAPIData: Product[]) => {
  return productsAPIData.reduce((acc, product) => {
    acc[product.id] = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock
    };
    return acc;
  }, {} as Record<string, Product>);
};
