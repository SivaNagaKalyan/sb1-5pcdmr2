import { useAuth } from '../../context/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to your {user?.role} dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {user?.role === 'inventory' ? (
          <>
            <DashboardCard
              title="Total Items"
              value="1,234"
              description="Items in inventory"
            />
            <DashboardCard
              title="Low Stock"
              value="12"
              description="Items below threshold"
            />
            <DashboardCard
              title="Pending Orders"
              value="45"
              description="Orders to be processed"
            />
          </>
        ) : (
          <>
            <DashboardCard
              title="Today's Deliveries"
              value="8"
              description="Remaining deliveries"
            />
            <DashboardCard
              title="Completed"
              value="15"
              description="Deliveries today"
            />
            <DashboardCard
              title="Route Efficiency"
              value="92%"
              description="On-time delivery rate"
            />
          </>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  value, 
  description 
}: { 
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-blue-600">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}