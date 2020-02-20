import { Model } from "objection";

class ChecklistItem extends Model {
  static get tableName() {
    return "checklistItems";
  }

  id: number;
  customerId: number;
  checklistId: number;
  name: string;
  createdAt: Date;
  completedAt: Date | null;
  order: number;
}

export default ChecklistItem;
