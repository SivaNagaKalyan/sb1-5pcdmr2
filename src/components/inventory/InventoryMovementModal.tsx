import { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import type { InventoryItem, InventoryMovement } from '../../types/inventory';

interface InventoryMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem;
  type: 'in' | 'out';
}

const initialFormData = {
  quantity: 0,
  reason: '',
  damageReport: {
    isDamaged: false,
    description: '',
  },
};

export function InventoryMovementModal({ isOpen, onClose, item, type }: InventoryMovementModalProps) {
  const { updateInventoryMovement } = useInventory();
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const movement: Omit<InventoryMovement, 'id' | 'date'> = {
        itemId: item.id,
        type,
        quantity: formData.quantity,
        reason: formData.reason,
        userId: 'current-user-id', // In a real app, get from auth context
        damageReport: formData.damageReport.isDamaged ? {
          isDamaged: true,
          description: formData.damageReport.description,
          reportedBy: 'current-user-name', // In a real app, get from auth context
          reportDate: new Date().toISOString(),
        } : undefined,
      };

      await updateInventoryMovement.mutateAsync(movement);
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error('Failed to update inventory:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {type === 'in' ? 'Stock In' : 'Stock Out'}: {item.name}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              required
              min="1"
              max={type === 'out' ? item.quantity : undefined}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                quantity: parseInt(e.target.value) || 0 
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            >
              <option value="">Select a reason</option>
              {type === 'in' ? (
                <>
                  <option value="purchase">New Purchase</option>
                  <option value="return">Customer Return</option>
                  <option value="transfer">Warehouse Transfer</option>
                </>
              ) : (
                <>
                  <option value="sale">Sale</option>
                  <option value="damage">Damaged</option>
                  <option value="expired">Expired</option>
                  <option value="transfer">Warehouse Transfer</option>
                </>
              )}
            </select>
          </div>

          {type === 'out' && (
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.damageReport.isDamaged}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    damageReport: {
                      ...prev.damageReport,
                      isDamaged: e.target.checked,
                    },
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Item is Damaged</span>
              </label>

              {formData.damageReport.isDamaged && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Damage Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={formData.damageReport.description}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      damageReport: {
                        ...prev.damageReport,
                        description: e.target.value,
                      },
                    }))}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={updateInventoryMovement.isPending}
            >
              Confirm {type === 'in' ? 'Stock In' : 'Stock Out'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}