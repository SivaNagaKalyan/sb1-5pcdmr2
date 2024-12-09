import { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../../components/ui/button';
import { Plus, FileDown, Upload } from 'lucide-react';
import { generateInventoryReport } from '../../utils/reports';
import { AddItemModal } from '../../components/inventory/AddItemModal';
import { InventoryFilters, type InventoryFilters as Filters } from '../../components/inventory/InventoryFilters';
import { InventoryTable } from '../../components/inventory/InventoryTable';
import type { InventoryItem } from '../../types/inventory';

export function InventoryPage() {
  const { inventory, updateItem, deleteItem } = useInventory();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    damaged: false,
    perishable: false
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const items = JSON.parse(content);
          // In a real app, you would validate the data and send it to the backend
          console.log('Uploaded inventory:', items);
        } catch (error) {
          console.error('Failed to parse inventory file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredItems = inventory.data?.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.sku.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesDamaged = !filters.damaged || item.isDamaged;
    const matchesPerishable = !filters.perishable || item.isPerishable;
    const matchesExpiry = !filters.expiryBefore || 
      (item.expiryDate && new Date(item.expiryDate) <= new Date(filters.expiryBefore));

    return matchesSearch && matchesCategory && matchesDamaged && matchesPerishable && matchesExpiry;
  });

  const handleEdit = (item: InventoryItem) => {
    // Implement edit functionality
    console.log('Edit item:', item);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  const handleExport = () => {
    if (inventory.data) {
      generateInventoryReport(inventory.data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex gap-4">
          <Button onClick={handleExport}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <label className="cursor-pointer">
            <Button as="div">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <InventoryFilters onFilterChange={setFilters} />

      <div className="bg-white shadow rounded-lg">
        <InventoryTable
          items={filteredItems || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}