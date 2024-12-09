import { useState } from 'react';
import { useDeliveries } from '../../hooks/useDeliveries';
import { DeliveryCard } from './DeliveryCard';
import { DeliveryStatusModal } from './DeliveryStatusModal';
import { Button } from '../ui/button';
import { Calendar, Filter } from 'lucide-react';
import type { Delivery } from '../../types/delivery';

export function DeliveryList() {
  const { deliveries } = useDeliveries();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showPending, setShowPending] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const filteredDeliveries = deliveries.data?.filter(delivery => {
    const matchesDate = delivery.scheduledDate.startsWith(selectedDate);
    const matchesStatus = showPending ? delivery.status === 'pending' : true;
    return matchesDate && matchesStatus;
  });

  const priorityDeliveries = filteredDeliveries?.filter(d => d.priority === 'high') || [];
  const regularDeliveries = filteredDeliveries?.filter(d => d.priority !== 'high') || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <Button
            variant={showPending ? 'primary' : 'secondary'}
            onClick={() => setShowPending(!showPending)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showPending ? 'Showing Pending' : 'Showing All'}
          </Button>
        </div>
      </div>

      {priorityDeliveries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-600">Priority Deliveries</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {priorityDeliveries.map(delivery => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onStatusUpdate={() => setSelectedDelivery(delivery)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Regular Deliveries</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regularDeliveries.map(delivery => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onStatusUpdate={() => setSelectedDelivery(delivery)}
            />
          ))}
        </div>
      </div>

      {selectedDelivery && (
        <DeliveryStatusModal
          isOpen={!!selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          delivery={selectedDelivery}
        />
      )}
    </div>
  );
}