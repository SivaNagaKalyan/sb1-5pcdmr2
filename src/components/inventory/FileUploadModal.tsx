import { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../ui/button';
import { X, Upload, AlertCircle } from 'lucide-react';
import type { InventoryItem } from '../../types/inventory';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  const { bulkUpload } = useInventory();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<InventoryItem[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError('');
    
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.json')) {
        setError('Please upload a JSON file');
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const items = JSON.parse(content);
          
          if (!Array.isArray(items)) {
            throw new Error('Invalid format: File must contain an array of items');
          }
          
          setPreview(items);
        } catch (error) {
          setError('Invalid JSON format');
          setFile(null);
          setPreview([]);
        }
      };

      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (preview.length > 0) {
      try {
        await bulkUpload.mutateAsync(preview);
        onClose();
      } catch (error) {
        setError('Failed to upload inventory');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Inventory File</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload a JSON file
                  </span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">JSON file up to 10MB</p>
            </div>
          </div>

          {preview.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Preview ({preview.length} items)</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.slice(0, 5).map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {preview.length > 5 && (
                  <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
                    And {preview.length - 5} more items...
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || preview.length === 0}
              isLoading={bulkUpload.isPending}
            >
              Upload Inventory
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}