import { useState } from 'react';
import { Button } from '../ui/button';
import { PRODUCT_CATEGORIES } from '../../types/inventory';

interface InventoryFiltersProps {
  onFilterChange: (filters: InventoryFilters) => void;
}

export interface InventoryFilters {
  search: string;
  category: string;
  damaged: boolean;
  perishable: boolean;
  expiryBefore?: string;
}

export function InventoryFilters({ onFilterChange }: InventoryFiltersProps) {
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    category: '',
    damaged: false,
    perishable: false
  });

  const handleFilterChange = (key: keyof InventoryFilters, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search by name or SKU..."
          className="w-full px-3 py-2 border rounded-md"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry Before</label>
          <input
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300"
            value={filters.expiryBefore}
            onChange={(e) => handleFilterChange('expiryBefore', e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.damaged}
            onChange={(e) => handleFilterChange('damaged', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Show Damaged Items</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.perishable}
            onChange={(e) => handleFilterChange('perishable', e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Show Perishable Items</span>
        </label>
      </div>

      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={() => {
            const resetFilters = {
              search: '',
              category: '',
              damaged: false,
              perishable: false,
              expiryBefore: undefined
            };
            setFilters(resetFilters);
            onFilterChange(resetFilters);
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}