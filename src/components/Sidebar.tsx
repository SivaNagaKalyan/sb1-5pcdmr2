import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Truck,
  FileText,
  Settings 
} from 'lucide-react';

export function Sidebar() {
  const { user } = useAuth();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ...(user?.role === 'inventory' ? [
      { to: '/inventory', icon: Package, label: 'Inventory' },
      { to: '/reports', icon: FileText, label: 'Reports' }
    ] : [
      { to: '/deliveries', icon: Truck, label: 'Deliveries' }
    ]),
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}