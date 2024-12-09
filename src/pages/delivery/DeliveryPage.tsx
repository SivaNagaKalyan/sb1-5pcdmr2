import { DeliveryList } from '../../components/delivery/DeliveryList';

export function DeliveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Deliveries</h1>
        <p className="text-gray-500">Manage your daily deliveries and update their status</p>
      </div>

      <DeliveryList />
    </div>
  );
}