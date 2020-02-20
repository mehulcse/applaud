import { Model } from "objection";

class Note extends Model {
  static get tableName() {
    return "notes";
  }

  id: number;
  entity: string;
  entityId: string;
  userId: number;
  createdAt: Date;
  content: string;
  lastUpdatedAt: Date | null;
}

export default Note;
