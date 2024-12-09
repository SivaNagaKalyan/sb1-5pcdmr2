import { type InventoryItem } from '../../types/inventory';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryTable({ items, onEdit, onDelete }: InventoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className={item.isDamaged ? 'bg-red-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.name}
                {item.isPerishable && (
                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Perishable
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'in_stock'
                      ? 'bg-green-100 text-green-800'
                      : item.status === 'low_stock'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}