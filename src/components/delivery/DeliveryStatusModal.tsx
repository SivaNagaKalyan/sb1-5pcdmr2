import { useState } from 'react';
import { useDeliveries } from '../../hooks/useDeliveries';
import { Button } from '../ui/button';
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import type { Delivery } from '../../types/delivery';

interface DeliveryStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery;
}

type StatusUpdate = {
  status: 'delivered' | 'failed' | 'returned';
  reason?: string;
  signature?: string;
  notes?: string;
};

export function DeliveryStatusModal({ isOpen, onClose, delivery }: DeliveryStatusModalProps) {
  const { updateStatus } = useDeliveries();
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdate>({
    status: 'delivered',
    notes: '',
  });
  const [signatureRef, setSignatureRef] = useState<SignatureCanvas | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStatus.mutateAsync({
        id: delivery.id,
        status: statusUpdate.status,
        details: {
          notes: statusUpdate.notes,
          signature: signatureRef?.toDataURL(),
        },
      });
      onClose();
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Delivery Status</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className={`flex flex-col items-center p-3 rounded-lg border ${
                  statusUpdate.status === 'delivered'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setStatusUpdate(prev => ({ ...prev, status: 'delivered' }))}
              >
                <CheckCircle className={`h-6 w-6 ${
                  statusUpdate.status === 'delivered' ? 'text-green-500' : 'text-gray-400'
                }`} />
                <span className="text-sm mt-1">Delivered</span>
              </button>

              <button
                type="button"
                className={`flex flex-col items-center p-3 rounded-lg border ${
                  statusUpdate.status === 'failed'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setStatusUpdate(prev => ({ ...prev, status: 'failed' }))}
              >
                <XCircle className={`h-6 w-6 ${
                  statusUpdate.status === 'failed' ? 'text-red-500' : 'text-gray-400'
                }`} />
                <span className="text-sm mt-1">Failed</span>
              </button>

              <button
                type="button"
                className={`flex flex-col items-center p-3 rounded-lg border ${
                  statusUpdate.status === 'returned'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setStatusUpdate(prev => ({ ...prev, status: 'returned' }))}
              >
                <AlertTriangle className={`h-6 w-6 ${
                  statusUpdate.status === 'returned' ? 'text-amber-500' : 'text-gray-400'
                }`} />
                <span className="text-sm mt-1">Returned</span>
              </button>
            </div>
          </div>

          {statusUpdate.status === 'delivered' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Customer Signature
              </label>
              <div className="border rounded-lg p-2 bg-gray-50">
                <SignatureCanvas
                  ref={(ref) => setSignatureRef(ref)}
                  canvasProps={{
                    className: 'signature-canvas w-full h-40 bg-white',
                  }}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => signatureRef?.clear()}
              >
                Clear Signature
              </Button>
            </div>
          )}

          {(statusUpdate.status === 'failed' || statusUpdate.status === 'returned') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={statusUpdate.reason}
                onChange={(e) => setStatusUpdate(prev => ({ ...prev, reason: e.target.value }))}
                required
              >
                <option value="">Select a reason</option>
                {statusUpdate.status === 'failed' ? (
                  <>
                    <option value="door_lock">Door Lock - No Response</option>
                    <option value="wrong_address">Wrong Address</option>
                    <option value="customer_unavailable">Customer Unavailable</option>
                    <option value="customer_refused">Customer Refused Delivery</option>
                  </>
                ) : (
                  <>
                    <option value="damaged">Item Damaged</option>
                    <option value="wrong_item">Wrong Item</option>
                    <option value="customer_rejected">Customer Rejected Item</option>
                    <option value="quality_issues">Quality Issues</option>
                  </>
                )}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              value={statusUpdate.notes}
              onChange={(e) => setStatusUpdate(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes here..."
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={updateStatus.isPending}>
              Update Status
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}