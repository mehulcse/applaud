import { Model } from "objection";

export const ORDER_STATUS = {
  NEW: {
    id: "new",
    name: "New"
  },
  IN_PROGRESS: {
    id: "in_progress",
    name: "In Progress"
  },
  COMPLETED: {
    id: "completed",
    name: "Completed"
  },
  CANCELLED: {
    id: "cancelled",
    name: "Cancelled"
  }
};

export class OrderStatus {
  id: string;
  name: string;
}

class Order extends Model {
  static get tableName() {
    return "orders";
  }

  id: number;
  createdAt: Date;
  customerId: number;
  userId: number;
  status: string;
  partnerProductId: number;
  startDate: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
  customerKeywordId: number | null;
  completedAt: Date | null;
}

export default Order;
