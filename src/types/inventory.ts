export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStockLevel: number;
  category: string;
  location: string;
  lastUpdated: string;
  price: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  isDamaged: boolean;
  isPerishable: boolean;
  expiryDate?: string;
  batchNumber?: string;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  reason: string;
  userId: string;
  deliveryId?: string;
  damageReport?: {
    isDamaged: boolean;
    description: string;
    reportedBy: string;
    reportDate: string;
  };
}

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Food & Beverages',
  'Home & Garden',
  'Health & Beauty',
  'Sports & Outdoors',
  'Toys & Games',
  'Books & Media',
  'Automotive',
  'Other'
] as const;

// Mock data
export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    sku: 'HDPH001',
    quantity: 50,
    minStockLevel: 20,
    category: 'Electronics',
    location: 'A1-B2',
    lastUpdated: new Date().toISOString(),
    price: 99.99,
    status: 'in_stock',
    isDamaged: false,
    isPerishable: false
  },
  {
    id: '2',
    name: 'Organic Apples',
    sku: 'FOOD001',
    quantity: 100,
    minStockLevel: 50,
    category: 'Food & Beverages',
    location: 'C1-D1',
    lastUpdated: new Date().toISOString(),
    price: 2.99,
    status: 'in_stock',
    isDamaged: false,
    isPerishable: true,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];