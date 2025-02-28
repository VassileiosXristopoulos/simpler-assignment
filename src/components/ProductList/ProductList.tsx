import { useEffect, useState } from 'react'
import { ProductCard } from 'components/cards/ProductCard';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { useProductContext } from 'contexts/ProductContext';
import { getProducts } from 'api/productsApi'
import { useCart } from 'components/cart/useCart';

export function ProductList() {
  const { products, setProducts } = useProductContext()
  const [error, setError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    try {
      const retrievedProducts = await getProducts();
      if (retrievedProducts) {
        setProducts(retrievedProducts)
      }
    } catch (error) {
      setError("Error while fetching products: " + String(error));
    } finally {
      setProductsLoading(false)
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(products).map(([productId, product]) => (
        <ProductCard
          key={productId}
          product={product}
          onAddToCart={addToCart}
        />
      ))}

      {productsLoading && <LoadingSpinner />}
      {error &&
        <div className="bg-red-500 text-white p-4 rounded-md mb-4">
          {error}
        </div>}
    </div>
  );
}
