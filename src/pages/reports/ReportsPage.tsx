import { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { useDeliveries } from '../../hooks/useDeliveries';
import { Button } from '../../components/ui/button';
import { FileDown } from 'lucide-react';
import { generateInventoryReport, generateDeliveryReport } from '../../utils/reports';

export function ReportsPage() {
  const { inventory } = useInventory();
  const { deliveries } = useDeliveries();
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleGenerateInventoryReport = () => {
    if (inventory.data) {
      generateInventoryReport(inventory.data);
    }
  };

  const handleGenerateDeliveryReport = () => {
    if (deliveries.data) {
      const filteredDeliveries = deliveries.data.filter(delivery => {
        const deliveryDate = new Date(delivery.scheduledDate).toISOString().split('T')[0];
        return deliveryDate >= startDate && deliveryDate <= endDate;
      });
      generateDeliveryReport(filteredDeliveries);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inventory Reports */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Inventory Reports</h2>
          <div className="space-y-4">
            <Button
              onClick={handleGenerateInventoryReport}
              className="w-full"
              isLoading={inventory.isLoading}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Current Inventory Status
            </Button>
          </div>
        </div>

        {/* Delivery Reports */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Delivery Reports</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button
              onClick={handleGenerateDeliveryReport}
              className="w-full"
              isLoading={deliveries.isLoading}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Generate Delivery Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}