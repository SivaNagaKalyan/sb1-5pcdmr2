import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page not found</p>
        <Button
          className="mt-8"
          onClick={() => navigate('/')}
        >
          Go back home
        </Button>
      </div>
    </div>
  );
}