import { DefaultLayout } from 'layouts/DefaultLayout'
import { getProducts } from 'api/productsApi'
import { useEffect } from 'react'

export default function Shop() {
  
  useEffect(() => {
    getProducts()
      .then((res) => res.json())
      .then((res) => {
      console.log(res)
    })
  }, [])
  return (
    <DefaultLayout 
      title="Available Products"
      backButtonText='Back to Home'
      backButtonPath='/'>
      <div>My Shop!!</div>
    </DefaultLayout>
  )
}
