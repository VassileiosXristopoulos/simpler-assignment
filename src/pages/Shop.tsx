import { DefaultLayout } from 'layouts/DefaultLayout'
import { getProducts } from 'api/productsApi'
import { useEffect, useState } from 'react'
import { useCart } from 'components/cart/useCart';
import { ProductList } from 'components/ProductList/ProductList';
import { useProductContext } from 'contexts/ProductContext';

export default function Shop() {
  const { products, setProducts } = useProductContext()
  const { addToCart } = useCart();
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const retrievedProducts = await getProducts();
      if (retrievedProducts) {
        setProducts(retrievedProducts)
      }
    } catch (error) {
      setError("Error while fetching products");
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
        {error &&
          <div className="bg-red-500 text-white p-4 rounded-md mb-4">
            {error}
          </div>}
      </div>
    </DefaultLayout>
  )
}
