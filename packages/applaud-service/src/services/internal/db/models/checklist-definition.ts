import { Model } from "objection";

class ChecklistDefinition extends Model {
  static get tableName() {
    return "checklistDefinitions";
  }

  id: number;
  name: string;
  partnerId: number;
  createdAt: Date;
}

export default ChecklistDefinition;
