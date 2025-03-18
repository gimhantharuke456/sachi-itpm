export interface Order {
  id: string;
  userId: string;
  totalBill: number;
  discount: number;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}
