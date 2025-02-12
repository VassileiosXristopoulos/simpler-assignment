import { DefaultLayout } from 'layouts/DefaultLayout'
import { getProducts } from 'api/productsApi'
import { useEffect } from 'react'
import { useFetch } from 'hooks/useFetch';
import { Product } from 'types';
import { LoadingSpinner } from 'components/LoadingSpinner';
import { useCart } from 'components/cart/useCart';
import { ProductList } from 'components/ProductList/ProductList';

export default function Shop() {
  const { data: products, isLoading, error } = useFetch<Product[]>(getProducts, []);
  useEffect(() => {
  }, [products])

  const {cart, addToCart } = useCart();
console.log("cart")
console.log(cart)
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
      <div className="py-6">
        {products && <ProductList
          products={products}
          onAddToCart={addToCart}
        />}
      </div>
    </DefaultLayout>
  )
}
