import { DefaultLayout } from 'layouts/DefaultLayout'
import { getProducts } from 'api/productsApi'
import { useEffect } from 'react'
import { useFetch } from 'hooks/useFetch';
import { Product } from 'types';

export default function Shop() {
  const { data: products, isLoading, error } = useFetch<Product[]>(getProducts, []);
  useEffect(() => {
    console.log(products)
    console.log(isLoading)
    console.log(error)
  }, [products])
  return (
    <DefaultLayout
      title="Available Products"
      backButtonText='Back to Home'
      backButtonPath='/'>
      <div>My Shop!!</div>
    </DefaultLayout>
  )
}
