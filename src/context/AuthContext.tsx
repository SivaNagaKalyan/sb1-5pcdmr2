import React, { createContext, useContext, useState } from 'react';
import type { User, AuthState } from '../types/auth';
import { MOCK_USERS } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const savedUser = localStorage.getItem('dlvery_user');
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      isLoading: false,
      error: null,
    };
  });

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('dlvery_user', JSON.stringify(userWithoutPassword));
      setState({
        user: userWithoutPassword,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to login',
        isLoading: false,
      }));
    }
  };

  const register = async (userData: User) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email === userData.email)) {
        throw new Error('User already exists');
      }

      // In a real app, you would make an API call to register the user
      MOCK_USERS.push(userData);
      
      const { password: _, ...userWithoutPassword } = userData;
      setState({
        user: userWithoutPassword,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false,
      }));
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      localStorage.removeItem('dlvery_user');
      setState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to logout',
        isLoading: false,
      }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}