import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { DeliveryPage } from './pages/delivery/DeliveryPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      
      {/* Protected routes */}
      <Route element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {user?.role === 'inventory' ? (
          <>
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </>
        ) : (
          <Route path="/deliveries" element={<DeliveryPage />} />
        )}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}