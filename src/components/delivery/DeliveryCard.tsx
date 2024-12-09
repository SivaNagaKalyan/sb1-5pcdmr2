import { MapPin, Package, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import type { Delivery } from '../../types/delivery';
import { formatDistanceToNow } from 'date-fns';

interface DeliveryCardProps {
  delivery: Delivery;
  onStatusUpdate: () => void;
}

export function DeliveryCard({ delivery, onStatusUpdate }: DeliveryCardProps) {
  const hasPerishableItems = delivery.items.some(item => item.isPerishable);

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">Order #{delivery.orderId}</h3>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(delivery.scheduledDate), { addSuffix: true })}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium
          ${delivery.priority === 'high' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-blue-100 text-blue-800'}`}>
          {delivery.priority} priority
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gray-400 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">{delivery.customerName}</p>
            <p className="text-sm text-gray-500">{delivery.customerAddress}</p>
            <p className="text-sm text-gray-500">{delivery.customerPhone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-gray-400" />
          <p className="text-sm text-gray-600">
            {delivery.items.length} items
          </p>
        </div>

        {hasPerishableItems && (
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="h-4 w-4" />
            <p className="text-sm font-medium">Contains perishable items</p>
          </div>
        )}

        {delivery.status === 'failed' && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm font-medium">Failed delivery attempt</p>
          </div>
        )}
      </div>

      {delivery.status === 'pending' && (
        <Button onClick={onStatusUpdate} className="w-full">
          Update Status
        </Button>
      )}
    </div>
  );
}