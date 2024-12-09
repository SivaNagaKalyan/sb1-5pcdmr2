import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { InventoryItem, InventoryMovement } from '../types/inventory';

export function useInventory() {
  const queryClient = useQueryClient();

  const inventory = useQuery({
    queryKey: ['inventory'],
    queryFn: api.getInventory
  });

  const addItem = useMutation({
    mutationFn: api.addInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });

  const updateItem = useMutation({
    mutationFn: api.updateInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });

  const deleteItem = useMutation({
    mutationFn: api.deleteInventoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });

  const updateInventoryMovement = useMutation({
    mutationFn: api.updateInventoryMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });

  const bulkUpload = useMutation({
    mutationFn: api.bulkUploadInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });

  return {
    inventory,
    addItem,
    updateItem,
    deleteItem,
    updateInventoryMovement,
    bulkUpload
  };
}