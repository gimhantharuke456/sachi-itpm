export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  inStock: number;
  deleteStatus: boolean;
  createdAt: string;
  updatedAt: string;
}
