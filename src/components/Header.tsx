import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Package } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">DLVery</span>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}