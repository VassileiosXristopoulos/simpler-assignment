import { DefaultLayout } from 'layouts/DefaultLayout'
import { getProducts } from 'api/productsApi'
import { useEffect, useState } from 'react'
import { useCart } from 'components/cart/useCart';
import { ProductList } from 'components/ProductList/ProductList';
import { useProductContext } from 'contexts/ProductContext';
import { LoadingSpinner } from 'components/LoadingSpinner';

export default function Shop() {
  const { products, setProducts } = useProductContext()
  const [error, setError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    setProductsLoading(true);
    setError(null);
    
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
    <DefaultLayout
      title="Products"
      backButtonPath='/'>
      <div className="py-6">
        {products && <ProductList
          products={products}
          onAddToCart={addToCart}
        />}
        {productsLoading && <LoadingSpinner />}
        {error &&
          <div className="bg-red-500 text-white p-4 rounded-md mb-4">
            {error}
          </div>}
      </div>
    </DefaultLayout>
  )
}
