import { DefaultLayout } from 'layouts/DefaultLayout'
import { ProductList } from 'components/ProductList'

export default function Shop() {

  return (
    <DefaultLayout
      title="Shop"
      backButtonPath='/'>
      <div className="py-6">
        <ProductList />
      </div>
    </DefaultLayout>
  )
}
