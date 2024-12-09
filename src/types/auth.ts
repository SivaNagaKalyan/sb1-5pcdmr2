export interface User {
  id: string;
  email: string;
  role: 'inventory' | 'delivery';
  name: string;
  password: string; // Only used during registration
}

export interface AuthState {
  user: Omit<User, 'password'> | null;
  isLoading: boolean;
  error: string | null;
}

// Mock users for demonstration
export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'warehouse@dlvery.com',
    password: 'warehouse123',
    role: 'inventory',
    name: 'Warehouse Admin'
  },
  {
    id: '2',
    email: 'driver@dlvery.com',
    password: 'driver123',
    role: 'delivery',
    name: 'John Driver'
  }
];