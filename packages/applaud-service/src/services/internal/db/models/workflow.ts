import { Model } from "objection";

export const WORKFLOW_STATUS = {
  NEW: { id: "new", name: "New" },
  IN_PROGRESS: { id: "in_progress", name: "In Progress" },
  COMPLETED: { id: "completed", name: "Completed" }
};

class Workflow extends Model {
  static get tableName() {
    return "workflows";
  }

  id: number;
  status: string;
  customerId: number;
  type: string;
  orderId: number;
  internalStatus: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  completedAt: Date | null;
}

export default Workflow;
