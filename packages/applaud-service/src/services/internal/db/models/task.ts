import { Model } from "objection";

export const TASK_STATUS = {
  PENDING: {
    id: "pending",
    name: "Pending"
  },
  AVAILABLE: {
    id: "available",
    name: "Available"
  },
  ASSIGNED: {
    id: "assigned",
    name: "Assigned"
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

export class TaskStatus {
  id: string;
  name: string;
}

class Task extends Model {
  static get tableName() {
    return "tasks";
  }

  id: number;
  customerId: number;
  vendorId: number | null;
  workflowId: number;
  taskTypeId: string;
  status: string;
  createdAt: Date;
  availableAt: Date;
  assignedUserId: number | null;
  completedAt: Date | null;
}

export default Task;
