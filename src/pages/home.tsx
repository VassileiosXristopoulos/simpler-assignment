import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  console.log("Home!!")
  return <>
    <button
      onClick={() => navigate('/shop')}
      className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
    >
      Go to Shop
    </button>
  </>;
}
