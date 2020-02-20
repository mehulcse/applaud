import { Model } from "objection";

class Checklist extends Model {
  static get tableName() {
    return "checklists";
  }

  id: number;
  name: string;
  customerId: number;
  checklistDefinitionId: number;
  taskId: number;
  createdAt: Date;
}

export default Checklist;
