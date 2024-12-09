import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Delivery } from '../types/delivery';

export function useDeliveries() {
  const queryClient = useQueryClient();

  const deliveries = useQuery({
    queryKey: ['deliveries'],
    queryFn: api.getDeliveries
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status, details }: {
      id: string;
      status: Delivery['status'];
      details?: Partial<Delivery>;
    }) => api.updateDeliveryStatus(id, status, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    }
  });

  return {
    deliveries,
    updateStatus
  };
}