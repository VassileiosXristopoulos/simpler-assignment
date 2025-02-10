import { DefaultLayout } from 'layouts/DefaultLayout'
import { getProducts } from 'api/productsApi'
import { useEffect } from 'react'
import { useFetch } from 'hooks/useFetch';
import { Product } from 'types';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { ProductCard } from 'components/cards/ProductCard';
import { useCart } from 'components/cart/useCart';

export default function Shop() {
  const { data: products, isLoading, error } = useFetch<Product[]>(getProducts, []);
  useEffect(() => {
  }, [products])

  const { addToCart } = useCart();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    throw new Error(error); // todo: test & fix
  }

  return (
    <DefaultLayout
      title="Products"
      backButtonPath='/'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => {
          return <ProductCard key={product.id} product={product} onAddToCart={() => { addToCart(product) }} />
        })}
      </div>
    </DefaultLayout>
  )
}
