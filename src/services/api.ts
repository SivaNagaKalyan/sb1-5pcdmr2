import { InventoryItem, MOCK_INVENTORY } from '../types/inventory';
import { Delivery, MOCK_DELIVERIES } from '../types/delivery';
import type { InventoryMovement } from '../types/inventory';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    await delay(1000);
    return MOCK_INVENTORY;
  },

  async updateInventoryItem(item: InventoryItem): Promise<InventoryItem> {
    await delay(1000);
    const index = MOCK_INVENTORY.findIndex(i => i.id === item.id);
    if (index === -1) throw new Error('Item not found');
    MOCK_INVENTORY[index] = item;
    return item;
  },

  async addInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    await delay(1000);
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      lastUpdated: new Date().toISOString()
    };
    MOCK_INVENTORY.push(newItem);
    return newItem;
  },

  async deleteInventoryItem(id: string): Promise<void> {
    await delay(1000);
    const index = MOCK_INVENTORY.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    MOCK_INVENTORY.splice(index, 1);
  },

  async updateInventoryMovement(movement: Omit<InventoryMovement, 'id' | 'date'>): Promise<void> {
    await delay(1000);
    const item = MOCK_INVENTORY.find(i => i.id === movement.itemId);
    if (!item) throw new Error('Item not found');

    // Update quantity
    if (movement.type === 'in') {
      item.quantity += movement.quantity;
    } else {
      if (item.quantity < movement.quantity) {
        throw new Error('Insufficient quantity');
      }
      item.quantity -= movement.quantity;
    }

    // Update status based on new quantity
    item.status = 
      item.quantity === 0 ? 'out_of_stock' :
      item.quantity <= item.minStockLevel ? 'low_stock' :
      'in_stock';

    // Update damage status if applicable
    if (movement.damageReport?.isDamaged) {
      item.isDamaged = true;
    }

    item.lastUpdated = new Date().toISOString();
  },

  async bulkUploadInventory(items: InventoryItem[]): Promise<void> {
    await delay(2000);
    for (const item of items) {
      const existingIndex = MOCK_INVENTORY.findIndex(i => i.sku === item.sku);
      if (existingIndex !== -1) {
        MOCK_INVENTORY[existingIndex] = {
          ...item,
          lastUpdated: new Date().toISOString()
        };
      } else {
        MOCK_INVENTORY.push({
          ...item,
          id: crypto.randomUUID(),
          lastUpdated: new Date().toISOString()
        });
      }
    }
  },

  // Deliveries
  async getDeliveries(): Promise<Delivery[]> {
    await delay(1000);
    return MOCK_DELIVERIES;
  },

  async updateDeliveryStatus(
    id: string,
    status: Delivery['status'],
    details?: Partial<Delivery>
  ): Promise<Delivery> {
    await delay(1000);
    const delivery = MOCK_DELIVERIES.find(d => d.id === id);
    if (!delivery) throw new Error('Delivery not found');
    
    Object.assign(delivery, {
      status,
      ...details,
      ...(status === 'delivered' ? { deliveredAt: new Date().toISOString() } : {})
    });
    
    return delivery;
  }
};