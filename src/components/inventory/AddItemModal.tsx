import { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../../types/inventory';
import type { InventoryItem } from '../../types/inventory';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'> = {
  name: '',
  sku: '',
  quantity: 0,
  minStockLevel: 0,
  category: PRODUCT_CATEGORIES[0],
  location: '',
  price: 0,
  isDamaged: false,
  isPerishable: false,
  expiryDate: '',
  batchNumber: ''
};

export function AddItemModal({ isOpen, onClose }: AddItemModalProps) {
  const { addItem } = useInventory();
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addItem.mutateAsync({
        ...formData,
        status: formData.quantity > formData.minStockLevel ? 'in_stock' : 'low_stock',
        lastUpdated: new Date().toISOString()
      });
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Item</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Min Stock Level</label>
              <input
                type="number"
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.minStockLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, minStockLevel: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Batch Number</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.batchNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isDamaged}
                onChange={(e) => setFormData(prev => ({ ...prev, isDamaged: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Item is Damaged</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPerishable}
                onChange={(e) => setFormData(prev => ({ ...prev, isPerishable: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Perishable Item</span>
            </label>
          </div>

          {formData.isPerishable && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={addItem.isPending}>
              Add Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}