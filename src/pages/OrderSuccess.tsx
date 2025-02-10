import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { DefaultLayout } from '../layouts/DefaultLayout';
import { Button } from '../components/buttons/Button';

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <DefaultLayout cartVisible={false}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="relative inline-block mx-auto mb-6">
            <ShoppingBag className="text-green-600" size={64} />
            <CheckCircle 
              className="absolute -bottom-2 -right-2 text-green-500 bg-white rounded-full" 
              size={28} 
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
          <Button
            onClick={() => navigate('/shop')}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
