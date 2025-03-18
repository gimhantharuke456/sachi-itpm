import { InventoryItem } from "@/features/items/types";

export interface CartItem {
  item: InventoryItem;
  quantity: number;
}
