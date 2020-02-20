import { Model } from "objection";

class ChecklistDefinitionItem extends Model {
  static get tableName() {
    return "checklistDefinitionItems";
  }

  id: number;
  partnerId: number;
  checklistDefinitionId: number;
  name: string;
  createdAt: Date;
  order: number;
}

export default ChecklistDefinitionItem;
