import { DefaultLayout } from 'layouts/DefaultLayout'

export default function Shop() {
  return (
    <DefaultLayout 
      title="Available Products"
      backButtonText='Back to Home'
      backButtonPath='/'>
      <div>My Shop!!</div>
    </DefaultLayout>
  )
}
