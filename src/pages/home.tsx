import { useNavigate } from 'react-router-dom';
import { DefaultLayout } from 'layouts/DefaultLayout';

export default function Home() {
  const navigate = useNavigate();

  return <DefaultLayout cartVisible={true}>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Our Shop
        </h1>
        <p className="text-gray-600 mb-8">
          Discover our amazing collection of products at great prices.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          Go to Shop
        </button>
      </div>
    </div>
  </DefaultLayout>;
}
